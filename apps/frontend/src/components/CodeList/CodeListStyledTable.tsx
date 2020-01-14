import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {
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
import {faEdit, faGhost, faTrash} from "@fortawesome/free-solid-svg-icons";
import UpdateCodeListModal from "./ModalUpdateCodeList";
import {intl} from "../../util";
import DeleteCodeListModal from "./ModalDeleteCodeList";
import axios from "axios";
import {useTable} from "../../util/hooks"
import {AuditButton} from "../../pages/AuditPage"
import {getCodelistUsage} from "../../api"
import {Usage} from "./CodeListUsage"
import {CodeUsage} from "../../constants"
import {StatefulTooltip} from "baseui/tooltip";

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
    paddingBottom: "2px",
    paddingLeft: "0",
};

type TableCodelistProps = {
    tableData: Code[],
    hasAccess: boolean,
    refresh: () => void
};

const CodeListTable = ({tableData, hasAccess, refresh}: TableCodelistProps) => {
    const [useCss] = useStyletron();

    const [selectedCode, setSelectedCode] = React.useState<Code>();
    const [showUsage, setShowUsage] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [errorOnResponse, setErrorOnResponse] = React.useState(null);
    const [table, sortColumn] = useTable<Code, keyof Code>(tableData, {
        useDefaultStringCompare: true,
        initialSortColumn: "code"
    })
    const [usage, setUsage] = useState<CodeUsage>()

    useEffect(() => {
        if (showUsage && selectedCode) {
            (async () => {
                setUsage(undefined)
                const usage = await getCodelistUsage(selectedCode.list, selectedCode.code)
                setUsage(usage)
            })()
        }
    }, [showUsage, selectedCode])
    useEffect(() => setShowUsage(false), [tableData])

    const handleEditCodelist = async (values: Code) => {
        let body = [{
            ...values,
        }];
        try {
            await axios.put<Code[]>(`${server_polly}/codelist`, body)
            refresh()
            setShowEditModal(false);
        } catch (error) {
            setShowEditModal(true);
            setErrorOnResponse(error.message);
        }
    };

    const handleDeleteCodelist = async (values: { list: string, code: string }) => {
        try {
            await axios.delete(`${server_polly}/codelist/${values.list}/${values.code}`)
            refresh()
            setShowDeleteModal(false);
        } catch (error) {
            setShowDeleteModal(true);
            setErrorOnResponse(error.message);
        }
    };

    return (
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
                                <StatefulTooltip content={intl.ghost}>
                                    <Button
                                        size={ButtonSize.compact}
                                        kind={row === selectedCode && showUsage ? KIND.primary : KIND.tertiary}
                                        onClick={() => {
                                            setSelectedCode(row)
                                            setShowUsage(true)
                                        }}>
                                        <FontAwesomeIcon icon={faGhost}/>
                                    </Button>
                                </StatefulTooltip>
                                <AuditButton id={`${row.list}-${row.code}`} kind={KIND.tertiary}/>
                                <StatefulTooltip content={intl.edit}>
                                    <Button
                                        size={ButtonSize.compact}
                                        kind={KIND.tertiary}
                                        onClick={() => {
                                            setSelectedCode(row)
                                            setShowEditModal(true)
                                        }}>
                                        <FontAwesomeIcon icon={faEdit}/>
                                    </Button>
                                </StatefulTooltip>
                                <StatefulTooltip content={intl.delete}>
                                    <Button
                                        size={ButtonSize.compact}
                                        kind={KIND.tertiary}
                                        onClick={() => {
                                            setSelectedCode(row)
                                            setShowDeleteModal(true)
                                        }}>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </Button>
                                </StatefulTooltip>
                            </Block>)}</SmallCell>
                    </StyledRow>)}
                </StyledBody>

                {showEditModal && selectedCode && (
                    <UpdateCodeListModal
                        title={intl.editCodeListTitle}
                        initialValues={{
                            list: selectedCode.list ?? "",
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
                            list: selectedCode.list ?? "",
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

            {showUsage && <Usage usage={usage} refresh={refresh}/>}
        </React.Fragment>
    );
};
export default CodeListTable;