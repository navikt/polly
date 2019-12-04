import * as React from 'react';
import Banner from '../components/Banner';
import {codelist} from "../service/Codelist";
import {Select} from 'baseui/select';
import {Block} from "baseui/block";
import {
    SORT_DIRECTION,
    SortableHeadCell,
    StyledBody,
    StyledCell,
    StyledHead,
    StyledHeadCell,
    StyledRow,
    StyledTable
} from 'baseui/table';
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import UpdateCodeListModal from "../components/CodeList/ModalUpdateCodeList";
import CreateCodeListModal from "../components/CodeList/ModalCreateCodeList";
import DeleteCodeListModal from "../components/CodeList/ModalDeleteCodeList";
import axios from "axios";
import {useStyletron, withStyle} from "baseui";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Plus} from "baseui/icon";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const SmallerHeadCell = withStyle(StyledHeadCell, {
    maxWidth: '15%',
    wordBreak: "break-word",
});

const SmallCell = withStyle(StyledCell, {
    maxWidth: '15%',
    wordBreak: "break-word",
    paddingTop: "10",
    paddingBottom: "10"
});

const CodeListPage = () => {
    const [loading, setLoading] = React.useState(true);
    const [useCss] = useStyletron();
    const [codeListsTable, setCodeListsTable] = React.useState();
    const [selectedRow, setSelectedRow] = React.useState();
    const [selectedValue, setSelectedValue] = React.useState();

    const [updateCodeListModal, setUpdateCodeListModal] = React.useState(false);
    const [createCodeListModal, setCreateCodeListModal] = React.useState(false);
    const [deleteCodeListModal, setDeleteCodeListModal] = React.useState(false);

    const [codeDirection, setCodeDirection] = React.useState<any>(null);
    const [shortNameDirection, setShortNameDirection] = React.useState<any>(null);
    const [descriptionDirection, setDescriptionDirection] = React.useState<any>(null);

    const [errorOnResponse, setErrorOnResponse] = React.useState(null);

    const handleSort = (title: string, prevDirection: string) => {
        let nextDirection = null;
        if (prevDirection === SORT_DIRECTION.ASC) {
            nextDirection = SORT_DIRECTION.DESC;
        }
        if (prevDirection === SORT_DIRECTION.DESC) {
            nextDirection = null;
        }
        if (prevDirection === null) {
            nextDirection = SORT_DIRECTION.ASC;
        }
        if (title === 'Code') {
            setCodeDirection(nextDirection);
            setShortNameDirection(null);
            setDescriptionDirection(null);
            return;
        }
        if (title === 'Short Name') {
            setCodeDirection(null);
            setShortNameDirection(nextDirection);
            setDescriptionDirection(null);
            return;
        }
        if (title === 'Description') {
            setCodeDirection(null);
            setShortNameDirection(null);
            setDescriptionDirection(nextDirection);
            return;
        }
    };

    const getSortedData = () => {
        if (codeDirection) {
            const sorted = codeListsTable.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (codeDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (codeDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (shortNameDirection) {
            const sorted = codeListsTable.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (shortNameDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (shortNameDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        if (descriptionDirection) {
            const sorted = codeListsTable.slice(0).sort((a: any, b: any) =>
                a[0].localeCompare(b[0]),
            );
            if (descriptionDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (descriptionDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }

        return codeListsTable;
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await codelist.wait();
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleEditCodelist = async (values: any) => {
        let body = [{
            ...values,
        }];
        console.log(body);
        await axios
            .put(`${server_polly}/codelist`, body)
            .then(((response: any) => {
                console.log(response);
                console.log("Shayan codelist:");
                console.log(codelist);
                // setErrorEditPolicy(null)
                console.log(codelist.lists ? codelist.lists.codelist : "");
                console.log(codeListsTable);
                let codeListsTableTemp = codeListsTable.slice();
                let editedRowIndex = codeListsTableTemp
                    .findIndex((codeList: any) =>
                        codeList[0] === values.code
                    );

                console.log("Index=", editedRowIndex);
                codeListsTableTemp[editedRowIndex] = makeTableRow(values);
                console.log(codeListsTableTemp[editedRowIndex]);
                setCodeListsTable(codeListsTableTemp);
                setUpdateCodeListModal(false)
            }))
            .catch((error: any) => {
                setUpdateCodeListModal(true);
                setErrorOnResponse(error.message);
                console.log(error.message)
            });
    };

    const handleCreateCodelist = async (values: any) => {
        let body = [{
            ...values,
        }];
        console.log(body);
        await axios
            .post(`${server_polly}/codelist`, body)
            .then(((response: any) => {
                console.log(response);
                console.log("Shayan codelist:");
                console.log(codelist);
                // setErrorEditPolicy(null)
                console.log(codelist.lists ? codelist.lists.codelist : "");
                console.log(codeListsTable);
                let codeListsTableTemp = codeListsTable.slice();
                codeListsTableTemp.push(makeTableRow(values));
                console.log(codeListsTableTemp[codeListsTableTemp.length - 1]);
                setCodeListsTable(codeListsTableTemp);
                setCreateCodeListModal(false)
            }))
            .catch((error: any) => {
                setCreateCodeListModal(true);
                setErrorOnResponse(error.message);
                console.log(error.message);
            });
    };

    const handleDeleteCodelist = async (values: any) => {
        let {list, code} = values;
        console.log(list);
        console.log(code);
        await axios
            .delete(`${server_polly}/codelist/${list}/${code}`)
            .then(((response: any) => {
                console.log(response);
                console.log("Shayan codelist:");
                console.log(codelist);
                // setErrorEditPolicy(null)
                console.log(codelist.lists ? codelist.lists.codelist : "");
                console.log(codeListsTable);
                let codeListsTableTemp = codeListsTable.slice();
                let deletedRowIndex = codeListsTableTemp
                    .findIndex((codeList: any) =>
                        codeList[0] === code
                    );
                codeListsTableTemp.splice(deletedRowIndex,1);
                console.log("Index=", deletedRowIndex);
                console.log(codeListsTableTemp[deletedRowIndex]);
                setCodeListsTable(codeListsTableTemp);
                setDeleteCodeListModal(false)
            }))
            .catch((error: any) => {
                setDeleteCodeListModal(true);
                setErrorOnResponse(error.message);
                console.log(error.message);
            });
    };

    const makeTableRow = (codeList: any) => {
        return [
            codeList.code,
            codeList.shortName,
            codeList.description,
            <Block display="flex" justifyContent="flex-end" width="100%">
                <Button
                    size={ButtonSize.compact}
                    kind={KIND.secondary}
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
                    kind={KIND.secondary}
                    onClick={
                        () => {
                            setSelectedRow(codeList);
                            setDeleteCodeListModal(true)
                        }
                    }
                >
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Block>
        ];
    };

    return (
        <React.Fragment>
            <Banner title="Adminstrering av codelist"/>
            {loading ? null : (
                <Block>
                    <Select
                        options={codelist.makeIdLabelForAllCodeLists()}
                        onChange={({value}) => {
                            setSelectedValue(value);
                            console.log(value[0].id);
                            console.log(value);
                            console.log(codelist.lists!.codelist[value[0].id!]);
                            let codeLists = codelist
                                .lists!
                                .codelist[value[0].id!]
                                .map(codeList => makeTableRow(codeList));
                            console.log(codeLists);
                            setCodeListsTable(codeLists);
                        }}
                        clearable={false}
                        placeholder="Velg codelist"
                        value={selectedValue}
                    />
                    <UpdateCodeListModal
                        title='Rediger codelist'
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
                        title='Bekreft sletting'
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

            {!getSortedData() ? null :
                <React.Fragment>
                    <Block display="flex" justifyContent="flex-end">
                        <Button
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
                            Opprett nytt codelist
                        </Button>
                        <CreateCodeListModal
                            title="Nytt codelist"
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

                    <Block>
                        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                        <StyledTable className={useCss({overflow: "hidden !important"})}>
                            <StyledHead>
                                <SmallerHeadCell>
                                    <SortableHeadCell
                                        title="Code"
                                        direction={codeDirection}
                                        onSort={() =>
                                            handleSort('Code', codeDirection)
                                        }
                                    />
                                </SmallerHeadCell>
                                <SmallerHeadCell>
                                    <SortableHeadCell
                                        title="Short Name"
                                        direction={shortNameDirection}
                                        onSort={() =>
                                            handleSort('Short Name', shortNameDirection)
                                        }
                                    />
                                </SmallerHeadCell>
                                <StyledHeadCell styled={{
                                    maxWidth: '55%',
                                    minWidth: '24rem'
                                }}>
                                    <SortableHeadCell
                                        title="Description"
                                        direction={descriptionDirection}
                                        onSort={() =>
                                            handleSort('Description', descriptionDirection)
                                        }
                                    />
                                </StyledHeadCell>
                                <SmallerHeadCell/>
                            </StyledHead>
                            <StyledBody>
                                {getSortedData().map((row: any, index: any) => (
                                    <StyledRow key={index}>
                                        <SmallCell>{row[0]}</SmallCell>
                                        <SmallCell>{row[1]}</SmallCell>
                                        <StyledCell
                                            styled={{
                                                maxWidth: "55%",
                                                minWidth: "24rem",
                                                paddingTop: "10",
                                                paddingBottom: "10",
                                            }}
                                        >
                                            {row[2]}
                                        </StyledCell>
                                        <SmallCell>{row[3]}</SmallCell>
                                    </StyledRow>
                                ))}
                            </StyledBody>
                        </StyledTable>
                    </Block>
                </React.Fragment>
            }
        </React.Fragment>
    )
};

export default CodeListPage;