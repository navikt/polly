import React from "react";
import { RouteComponentProps } from "react-router-dom"
import { intl, useAwait } from "../util";
import Banner from "../components/Banner";
import { codelist } from "../service/Codelist";
import { Spinner } from "baseui/icon";
import { Block } from "baseui/block";
import { StatefulSelect, Select, TYPE, Value } from "baseui/select";
import { useDocumentSearch, getDocument } from "../api";
import { Document } from "../constants";
import DocumentMetadata from "../components/document/DocumentMetadata";
import { user } from "../service/User";
import { Button, SHAPE } from "baseui/button";
import { faPlusCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip";

const DocumentPage = (props: RouteComponentProps<{ id?: string }>) => {
    const [isLoading, setLoading] = React.useState()
    const [selectValue, setSelectValue] = React.useState<Value>([]);
    const [currentDocument, setCurrentDocument] = React.useState<Document | undefined>()
    const [documentSearchResult, setDocumentSearch, documentSearchLoading] = useDocumentSearch()
    const [documentId, setDocumentId] = React.useState<string | undefined>(props.match.params.id)

    useAwait(user.wait())

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            await codelist.wait();
            setLoading(false);
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            if (documentId) {
                const res = await getDocument(documentId)
                setCurrentDocument(res)
                setSelectValue([{ id: res.id, label: res.name }])
                props.history.push(`/document/${documentId}`)
            } else {
                setCurrentDocument(undefined)
                setSelectValue([])
                props.history.push('/document')
            }
        })();
    }, [documentId]);

    return (
        <React.Fragment>
            {isLoading && <Spinner />}

            {!isLoading && (
                <React.Fragment>
                    <Block display="flex" justifyContent="space-between">
                        <Block width="80%">
                            <Select
                                autoFocus
                                maxDropdownHeight="400px"
                                searchable={true}
                                type={TYPE.search}
                                options={documentSearchResult.map(doc => ({ id: doc.id, label: doc.name }))}
                                placeholder={intl.searchDocumentPlaceholder}
                                onInputChange={event => setDocumentSearch(event.currentTarget.value)}
                                onChange={(params) => params.value.length < 1 ? setDocumentId(undefined) : setDocumentId(params.value[0].id as string)}
                                isLoading={documentSearchLoading}
                                filterOptions={options => options}
                                value={selectValue}
                            />
                        </Block>
                        <Block>
                            {user.canWrite() && (
                                <Block display="flex">
                                    {currentDocument && (
                                        <StatefulTooltip content={intl.edit} placement={PLACEMENT.bottom}>
                                            <Button kind="secondary" onClick={() => props.history.push(`/document/edit/${currentDocument.id}`)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                        </StatefulTooltip>
                                    )}
                                    
                                    <Block marginLeft="scale400">
                                        <Button type="button" shape={SHAPE.square} onClick={() => props.history.push("/document/create")}>
                                            <FontAwesomeIcon icon={faPlusCircle} />&nbsp;{intl.createNew}
                                        </Button>
                                    </Block>
                                    
                                </Block>
                            )

                            }
                        </Block>
                    </Block>

                    {currentDocument && <DocumentMetadata document={currentDocument} />}
                </React.Fragment>
            )}

        </React.Fragment>
    );
};

export default DocumentPage;