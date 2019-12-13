import * as React from "react";
import Banner from "../components/Banner";
import {Code, codelist} from "../service/Codelist";
import {Select} from "baseui/select";
import {Block} from "baseui/block";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import CreateCodeListModal from "../components/CodeList/ModalCreateCodeList";
import axios from "axios";
import {Plus} from "baseui/icon";
import {user} from "../service/User";
import CodeListTable from "../components/CodeList/CodeListStyledTable";
import {intl} from "../util";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const CodeListPage = () => {
    const [loading, setLoading] = React.useState(true);
    const [currentCodelist, setCurrentCodelist] = React.useState();
    const [selectedValue, setSelectedValue] = React.useState();
    const [createCodeListModal, setCreateCodeListModal] = React.useState(false);
    const [errorOnResponse, setErrorOnResponse] = React.useState(null);

    const hasAccess = () => user.isAdmin();

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            await codelist.wait();
            setLoading(false);
        })();
    }, []);

    const handleCreateCodelist = async (values: Code) => {
        let body = [{
            ...values,
        }];
        await axios
            .post<Code[]>(`${server_polly}/codelist`, body)
            .then(((response) => {
                codelist.refreshCodeLists();
                setCurrentCodelist([...currentCodelist, response.data[0]]);
                setCreateCodeListModal(false)
            }))
            .catch((error: any) => {
                setCreateCodeListModal(true);
                setErrorOnResponse(error.message);
            });
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
                                .codelist[value[0].id!];

                            setCurrentCodelist(codeLists);
                        }}
                        clearable={false}
                        placeholder={intl.chooseCodeList}
                        value={selectedValue}
                    />

                </Block>
            )}

            {currentCodelist && selectedValue &&
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
                    <CodeListTable
                        tableData={currentCodelist}
                        hasAccess={hasAccess()}
                    />
                </Block>
            </React.Fragment>
            }
        </React.Fragment>
    )
};

export default CodeListPage;