import * as React from "react";
import Banner from "../components/Banner";
import {codelist} from "../service/Codelist";
import {Select} from "baseui/select";
import {Block} from "baseui/block";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import UpdateCodeListModal from "../components/CodeList/ModalUpdateCodeList";
import CreateCodeListModal from "../components/CodeList/ModalCreateCodeList";
import DeleteCodeListModal from "../components/CodeList/ModalDeleteCodeList";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Plus} from "baseui/icon";
import {user} from "../service/User";
import CodeListTable from "../components/CodeList/CodeListStyledTable";
import {intl} from "../util";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const CodeListPage = () => {
    const [loading, setLoading] = React.useState(true);
    const [codeListsTableData, setCodeListsTableData] = React.useState();
    const [selectedRow, setSelectedRow] = React.useState();
    const [selectedValue, setSelectedValue] = React.useState();

    const [updateCodeListModal, setUpdateCodeListModal] = React.useState(false);
    const [createCodeListModal, setCreateCodeListModal] = React.useState(false);
    const [deleteCodeListModal, setDeleteCodeListModal] = React.useState(false);

    const [errorOnResponse, setErrorOnResponse] = React.useState(null);

    const hasAccess = () => {
        if (user.isLoggedIn())
            return user.isAdmin();
        return false
    };

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            await codelist.wait();
            setLoading(false);
        })();
    }, []);

    const handleEditCodelist = async (values: any) => {
        let body = [{
            ...values,
        }];
        await axios
            .put(`${server_polly}/codelist`, body)
            .then(((response: any) => {
                codelist.refreshCodeLists();
                let codeListsTableTemp = codeListsTableData.slice();
                let editedRowIndex = codeListsTableTemp
                    .findIndex((codeList: any) =>
                        codeList[0] === values.code
                    );
                codeListsTableTemp[editedRowIndex] = makeTableRow(values);
                setCodeListsTableData(codeListsTableTemp);
                setUpdateCodeListModal(false)
            }))
            .catch((error: any) => {
                setUpdateCodeListModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const handleCreateCodelist = async (values: any) => {
        let body = [{
            ...values,
        }];
        await axios
            .post(`${server_polly}/codelist`, body)
            .then(((response: any) => {
                codelist.refreshCodeLists();
                let codeListsTableTemp = codeListsTableData.slice();
                codeListsTableTemp.push(makeTableRow(values));
                setCodeListsTableData(codeListsTableTemp);
                setCreateCodeListModal(false)
            }))
            .catch((error: any) => {
                setCreateCodeListModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const handleDeleteCodelist = async (values: any) => {
        await axios
            .delete(`${server_polly}/codelist/${values.list}/${values.code}`)
            .then(((response: any) => {
                codelist.refreshCodeLists();
                let codeListsTableTemp = codeListsTableData.slice();
                let deletedRowIndex = codeListsTableTemp
                    .findIndex((codeList: any) =>
                        codeList[0] === values.code
                    );
                codeListsTableTemp.splice(deletedRowIndex, 1);
                setCodeListsTableData(codeListsTableTemp);
                setDeleteCodeListModal(false);
            }))
            .catch((error: any) => {
                setDeleteCodeListModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const makeTableRow = (codeList: any) => {
        return [
            codeList.code,
            codeList.shortName,
            codeList.description,
            (hasAccess() && <Block display="flex" justifyContent="flex-end" width="100%">
                <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={
                        () => {
                            setSelectedRow(codeList);
                            setUpdateCodeListModal(true)
                        }
                    }
                >
                    <FontAwesomeIcon icon={faEdit}/>
                </Button>
                <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={
                        () => {
                            setSelectedRow(codeList);
                            setDeleteCodeListModal(true)
                        }
                    }
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </Button>
            </Block>)
        ];
    };

    return (
        <React.Fragment>
            <Banner title={intl.manageCodeListTitle}/>
            {loading ? null : (
                <Block>
                    <Select
                        options={codelist.makeIdLabelForAllCodeLists()}
                        onChange={({value}) => {
                            setSelectedValue(value);
                            let codeLists = codelist
                                .lists!
                                .codelist[value[0].id!]
                                .map(codeList => makeTableRow(codeList));

                            setCodeListsTableData(codeLists);
                        }}
                        clearable={false}
                        placeholder={intl.chooseCodeList}
                        value={selectedValue}
                    />
                    <UpdateCodeListModal
                        title={intl.editCodeListTitle}
                        list={selectedValue ? selectedValue[0].id!.toString() : ""}
                        code={selectedRow ? selectedRow.code : ""}
                        shortName={selectedRow ? selectedRow.shortName : ""}
                        description={selectedRow ? selectedRow.description : ""}
                        isOpen={updateCodeListModal}
                        onClose={() => {
                            setUpdateCodeListModal(!updateCodeListModal);
                            setErrorOnResponse(null);
                        }}
                        errorOnUpdate={errorOnResponse}
                        submit={handleEditCodelist}
                    />
                    <DeleteCodeListModal
                        title={intl.deleteCodeListConfirmationTitle}
                        list={selectedValue ? selectedValue[0].id!.toString() : ""}
                        code={selectedRow ? selectedRow.code : ""}
                        isOpen={deleteCodeListModal}
                        onClose={() => {
                            setDeleteCodeListModal(!deleteCodeListModal);
                            setErrorOnResponse(null);
                        }}
                        errorOnDelete={errorOnResponse}
                        submit={handleDeleteCodelist}
                    />
                </Block>
            )}

            {codeListsTableData &&
            <React.Fragment>
                {hasAccess() && (
                    <Block display="flex" justifyContent="flex-end">
                        <Button
                            $style={{
                                marginTop: "16px",
                                marginBottom: "16px",
                            }}
                            size={ButtonSize.compact}
                            kind={KIND.minimal}
                            onClick={() => setCreateCodeListModal(!createCodeListModal)}
                            startEnhancer={
                                () =>
                                    <Block
                                        display="flex"
                                        justifyContent="center">
                                        <Plus size={22}/>
                                    </Block>}
                        >
                            {intl.createNewCodeList}
                        </Button>
                        <CreateCodeListModal
                            title={intl.createCodeListTitle}
                            list={selectedValue ? selectedValue[0].id!.toString() : ""}
                            isOpen={createCodeListModal}
                            errorOnCreate={errorOnResponse}
                            onClose={
                                () => {
                                    setCreateCodeListModal(!createCodeListModal);
                                    setErrorOnResponse(null);
                                }
                            }
                            submit={handleCreateCodelist}
                        />
                    </Block>
                )}
                <Block>
                    <CodeListTable tableData={codeListsTableData}/>
                </Block>
            </React.Fragment>
            }
        </React.Fragment>
    )
};

export default CodeListPage;