import * as React from "react";
import { useEffect } from "react";
import { Block } from "baseui/block"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Select, TYPE } from "baseui/select"
import { RouteComponentProps } from "react-router-dom"


import InformationtypeMetadata from "../components/InformationType/InformationtypeMetadata/";
import { intl, theme, useAwait } from "../util"
import { CodeUsage, Disclosure, Document, InformationType, Policy } from "../constants"
import { codelist, ListName } from "../service/Codelist"
import { user } from "../service/User";
import { H4 } from "baseui/typography"
import {
  getCodelistUsageByListName,
  getDisclosuresByInformationTypeId,
  getDocumentsForInformationType,
  getInformationType,
  getPoliciesForInformationType,
  useInfoTypeSearch
} from "../api"
import InformationTypeAccordion from "../components/InformationType/ListCategoryInformationtype";
import { StyledSpinnerNext } from "baseui/spinner"
import Button from "../components/common/Button";

export type PurposeMap = { [purpose: string]: Policy[] }

const InformationtypePage = (props: RouteComponentProps<{ id?: string, purpose?: string }>) => {
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [informationTypeId, setInformationTypeId] = React.useState(props.match.params.id)
    const [informationtype, setInformationtype] = React.useState<InformationType>()
    const [policies, setPolicies] = React.useState<Policy[]>([])
    const [disclosures, setDisclosures] = React.useState<Disclosure[]>([])
    const [documents, setDocuments] = React.useState<Document[]>([])
    const [categoryUsages, setCategoryUsages] = React.useState<CodeUsage[]>();

    const [infoTypeSearchResult, setInfoTypeSearch, infoTypeSearchLoading] = useInfoTypeSearch()

    useAwait(user.wait())
    useAwait(codelist.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let response = await getCodelistUsageByListName(ListName.CATEGORY);
            setCategoryUsages(response.codesInUse);
            setLoading(false);
        };
        fetchData();
    },[]);

    useEffect(() => setInformationTypeId(props.match.params.id), [props.match.params.id]);

    useEffect(() => {
        const fetchData = async () => {
            if (!informationTypeId) {
                return;
            }
            setLoading(true);
            try {
                const infoType = await getInformationType(informationTypeId)
                const policies = await getPoliciesForInformationType(informationTypeId)
                const disclosureList = await getDisclosuresByInformationTypeId(informationTypeId)
                const docs = await getDocumentsForInformationType(informationTypeId)
                setInformationtype(infoType)
                setPolicies(policies.content)
                setDisclosures(disclosureList)
                setDocuments(docs.content)
            } catch (err) {
                setError(err.message)
            }

            if (!props.match.params.id) props.history.push(`/informationtype/${informationTypeId}`)
            setLoading(false);
        };
        fetchData();
    }, [informationTypeId]);

    return (
        <React.Fragment>
            {isLoading ? (
                <StyledSpinnerNext size={30} />
            ) : (informationTypeId ?
                <React.Fragment>
                    {!error && informationtype && (
                        <InformationtypeMetadata
                            informationtype={informationtype}
                            policies={policies}
                            disclosures={disclosures}
                            documents={documents}
                            expanded={props.match.params.purpose ? [props.match.params.purpose] : []}
                            onSelectPurpose={purpose => props.history.push(`/informationtype/${informationTypeId}/${purpose}`)}
                        />
                    )}

                    {error && (<p>{error}</p>)}
                </React.Fragment>
                : <React.Fragment>
                    <H4 marginTop={theme.sizing.scale200} >{intl.informationTypes}</H4>
                    <Block display="flex" justifyContent="space-between">
                        <Block width="80%">
                            <Select
                                autoFocus
                                maxDropdownHeight="400px"
                                searchable={true}
                                type={TYPE.search}
                                options={infoTypeSearchResult.map(it => ({id: it.id, label: it.name}))}
                                placeholder={intl.informationTypeSearch}
                                onInputChange={event => setInfoTypeSearch(event.currentTarget.value)}
                                onChange={(params) => setInformationTypeId(params.value[0].id as string)}
                                isLoading={infoTypeSearchLoading}
                                filterOptions={options => options}
                            />
                        </Block>
                        <Block>
                            {user.canWrite() &&
                            <Button kind="outline" onClick={() => props.history.push("/informationtype/create")}>
                              <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createNew}
                            </Button>
                            }
                        </Block>
                    </Block>
                    <InformationTypeAccordion categoryUsages={categoryUsages}/>
                </React.Fragment>

                )}
        </React.Fragment>
    );
};

export default InformationtypePage;
