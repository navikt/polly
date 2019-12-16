import * as React from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";
import { Code, codelist } from "../../service/Codelist";
import { Block } from "baseui/block";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import UpdateCodeListModal from "./ModalUpdateCodeList";
import { intl } from "../../util";
import DeleteCodeListModal from "./ModalDeleteCodeList";
import axios from "axios";
import { useTable } from "../../util/hooks"

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

const CodeListTable = ({ tableData, hasAccess }: TableCodelistProps) => {
    const [useCss] = useStyletron();

    const [selectedCode, setSelectedCode] = React.useState<Code>();
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [errorOnResponse, setErrorOnResponse] = React.useState(null);
    const [table, sortColumn] = useTable<Code, keyof Code>(tableData, {useDefaultStringCompare: true, initialSortColumn: "code"})

    const handleEditCodelist = async (values: Code) => {
        let body = [{
            ...values,
        }];
        await axios
            .put<Code[]>(`${server_polly}/codelist`, body)
            .then(((response) => {
                codelist.refreshCodeLists()
                setShowEditModal(false);
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
                setShowDeleteModal(false);
            }))
            .catch((error: any) => {
                setShowDeleteModal(true);
                setErrorOnResponse(error.message);
            });
    };

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
                        direction={table.direction.code}
                        onSort={() => sortColumn('code')}
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
                        direction={table.direction.shortName}
                        onSort={() => sortColumn('shortName')}
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
                        direction={table.direction.description}
                        onSort={() => sortColumn('description')}
                    />
                </StyledHeadCell>
                <SmallerHeadCell/>
            </StyledHead>
            <StyledBody>
                {table.data.map((row, index) => <StyledRow key={index}>
                    <SmallCell>{row.code}</SmallCell>
                    <SmallCell>{row.shortName}</SmallCell>
                    <StyledCell styled={{maxWidth: "55%", minWidth: "24rem",}}>{row.description}</StyledCell>
                    <SmallCell>{
                        (hasAccess && <Block display="flex" justifyContent="flex-end" width="100%">
                          <Button
                              size={ButtonSize.compact}
                              kind={KIND.tertiary}
                              onClick={() => {
                                  setSelectedCode(row)
                                  setShowEditModal(true)
                              }}>
                            <FontAwesomeIcon icon={faEdit}/>
                          </Button>
                          <Button
                              size={ButtonSize.compact}
                              kind={KIND.tertiary}
                              onClick={() => {
                                  setSelectedCode(row)
                                  setShowDeleteModal(true)
                              }}>
                            <FontAwesomeIcon icon={faTrash}/>
                          </Button>
                        </Block>)}</SmallCell>
                </StyledRow>)}
            </StyledBody>

            {showEditModal && selectedCode && (
                <UpdateCodeListModal
                    title={intl.editCodeListTitle}
                    initialValues={{
                        list: selectedCode.list ?? "" ,
                        code: selectedCode.code ?? "",
                        shortName: selectedCode.shortName ?? "",
                        description: selectedCode.description ?? ""
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
            {showDeleteModal && selectedCode && (
                <DeleteCodeListModal
                    title={intl.deleteCodeListConfirmationTitle}
                    initialValues={{
                        list: selectedCode.list ?? "" ,
                        code: selectedCode.code ?? "",
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