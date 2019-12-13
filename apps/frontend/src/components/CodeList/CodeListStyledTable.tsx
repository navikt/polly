import * as React from "react";
import {
    SORT_DIRECTION,
    SortableHeadCell,
    StyledBody,
    StyledCell,
    StyledHead,
    StyledHeadCell,
    StyledRow,
    StyledTable
} from "baseui/table";
import {useStyletron, withStyle} from "baseui";
import {Code, codelist} from "../../service/Codelist";
import {Block} from "baseui/block";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import UpdateCodeListModal from "./ModalUpdateCodeList";
import {intl} from "../../util";
import DeleteCodeListModal from "./ModalDeleteCodeList";
import axios from "axios";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;


const SmallerHeadCell = withStyle(StyledHeadCell, {
    maxWidth: "15%",
    wordBreak: "break-word",
});

const SmallCell = withStyle(StyledCell, {
    maxWidth: "15%",
    wordBreak: "break-word",
});

const headerStyle = {
    paddingTop: "2px",
    paddingRight: "16px",
    paddingBottom:"2px",
    paddingLeft:"0",
};

type TableCodelistProps = {
    tableData: Code[],
    hasAccess: boolean
};

// TODO replace array with object
type Row = [string, string, string, JSX.Element | boolean]

const CodeListTable = ({ tableData, hasAccess }: TableCodelistProps) => {
    const [useCss] = useStyletron();

    const [rows, setRows] = React.useState<Row[]>([]);
    const [selectedRow, setSelectedRow] = React.useState<Code>();
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [errorOnResponse, setErrorOnResponse] = React.useState(null);

    const [codeDirection, setCodeDirection] = React.useState<SORT_DIRECTION | null>(null);
    const [shortNameDirection, setShortNameDirection] = React.useState<SORT_DIRECTION | null>(null);
    const [descriptionDirection, setDescriptionDirection] = React.useState<SORT_DIRECTION | null>(null);

    const makeTableRow = (codeList: Code) => {
        return [
            codeList.code,
            codeList.shortName,
            codeList.description,
            (hasAccess && <Block display="flex" justifyContent="flex-end" width="100%">
                <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={
                        () => {
                            setSelectedRow(codeList);
                            setShowEditModal(true)
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
                            setShowDeleteModal(true)
                        }
                    }
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </Button>
            </Block>)
        ] as Row
    }

    const handleEditCodelist = async (values: Code) => {
        let body = [{
            ...values,
        }];
        await axios
            .put<Code[]>(`${server_polly}/codelist`, body)
            .then(((response) => {
                let newRow = makeTableRow(response.data[0]);
                setRows([...rows.filter((row) => row[0] !== response.data[0].code), newRow]);
                setShowEditModal(false);
                codelist.refreshCodeLists()
            }))
            .catch((error: any) => {
                setShowEditModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const handleDeleteCodelist = async (values: { list: string, code: string}) => {
        await axios
            .delete(`${server_polly}/codelist/${values.list}/${values.code}`)
            .then((() => {
                codelist.refreshCodeLists();
                setRows(rows.filter((row) => row[0] !== values.code));
                setShowDeleteModal(false);
            }))
            .catch((error: any) => {
                setShowDeleteModal(true);
                setErrorOnResponse(error.message);
            });
    };

    const handleSort = (title: string, prevDirection: SORT_DIRECTION | null) => {
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
        if (title === intl.code) {
            setCodeDirection(nextDirection);
            setShortNameDirection(null);
            setDescriptionDirection(null);
            return;
        }
        if (title === intl.shortName) {
            setCodeDirection(null);
            setShortNameDirection(nextDirection);
            setDescriptionDirection(null);
            return;
        }
        if (title === intl.description) {
            setCodeDirection(null);
            setShortNameDirection(null);
            setDescriptionDirection(nextDirection);
            return;
        }
    };

    const getSortedData = () => {
        if (codeDirection) {
            const sorted = rows.slice(0).sort((a, b) =>
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
            const sorted = rows.slice(0).sort((a, b) =>
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
            const sorted = rows.slice(0).sort((a, b) =>
                a[0].localeCompare(b[0]),
            );
            if (descriptionDirection === SORT_DIRECTION.ASC) {
                return sorted;
            }
            if (descriptionDirection === SORT_DIRECTION.DESC) {
                return sorted.reverse();
            }
        }
        return rows;
    };

    React.useEffect(() => {
        setRows(tableData.map(row => makeTableRow(row)))
    }, [tableData]);

    return(
        <React.Fragment>
        <StyledTable className={useCss({overflow: "hidden !important"})}>
            <StyledHead>
                <SmallerHeadCell>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title={intl.code}
                        direction={codeDirection}
                        onSort={() =>
                            handleSort(intl.code, codeDirection)
                        }
                    />
                </SmallerHeadCell>
                <SmallerHeadCell>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title={intl.shortName}
                        direction={shortNameDirection}
                        onSort={() =>
                            handleSort(intl.shortName, shortNameDirection)
                        }
                    />
                </SmallerHeadCell>
                <StyledHeadCell styled={{
                    maxWidth: "55%",
                    minWidth: "24rem"
                }}>
                    <SortableHeadCell
                        overrides={{
                            HeadCell: {
                                style: headerStyle
                            }
                        }}
                        title={intl.description}
                        direction={descriptionDirection}
                        onSort={() =>
                            handleSort(intl.description, descriptionDirection)
                        }
                    />
                </StyledHeadCell>
                <SmallerHeadCell/>
            </StyledHead>
            <StyledBody>
                {rows && getSortedData().map((row, index) => (
                    <StyledRow key={index}>
                        <SmallCell>{row[0]}</SmallCell>
                        <SmallCell>{row[1]}</SmallCell>
                        <StyledCell
                            styled={{
                                maxWidth: "55%",
                                minWidth: "24rem",
                            }}
                        >
                            {row[2]}
                        </StyledCell>
                        <SmallCell>{row[3]}</SmallCell>
                    </StyledRow>
                ))}
            </StyledBody>

            {showEditModal && selectedRow && (
                <UpdateCodeListModal
                    title={intl.editCodeListTitle}
                    initialValues={{
                        list: selectedRow.list ?? "" ,
                        code: selectedRow.code ?? "",
                        shortName: selectedRow.shortName ?? "",
                        description: selectedRow.description ?? ""
                    }}
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(!showEditModal);
                        setErrorOnResponse(null);
                    }}
                    errorOnUpdate={errorOnResponse}
                    submit={handleEditCodelist}
                />

            )}
            {showDeleteModal && selectedRow && (
                <DeleteCodeListModal
                    title={intl.deleteCodeListConfirmationTitle}
                    initialValues={{
                        list: selectedRow.list ?? "" ,
                        code: selectedRow.code ?? "",
                    }}
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(!showDeleteModal);
                        setErrorOnResponse(null);
                    }}
                    errorOnDelete={errorOnResponse}
                    submit={handleDeleteCodelist}
                />
            )}
        </StyledTable>
        </React.Fragment>
    );
};

export default CodeListTable;