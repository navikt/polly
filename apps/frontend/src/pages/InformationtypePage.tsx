import * as React from "react";
import {useEffect} from "react";
import {Spinner} from "baseui/spinner";
import {Button, SHAPE} from "baseui/button"
import {Block} from "baseui/block"
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Select, TYPE} from "baseui/select"
import {RouteComponentProps} from "react-router-dom"


import InformationtypeMetadata from "../components/InformationType/InformationtypeMetadata/";
import {intl, theme, useAwait} from "../util"
import {CodeUsage, Policy} from "../constants"
import {codelist} from "../service/Codelist"
import Banner from "../components/Banner";
import {user} from "../service/User";
import {H3} from "baseui/typography"
import {getInformationType, getPoliciesForInformationType, useInfoTypeSearch} from "../api"
import InformationTypeAccordion from "../components/InformationType/ListCategoryInformationtype";
import {getCodelistUsageByListName} from "../api";

export type PurposeMap = { [purpose: string]: Policy[] }

const InformationtypePage = (props: RouteComponentProps<{ id?: string, purpose?: string }>) => {
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [informationTypeId, setInformationTypeId] = React.useState(props.match.params.id)
    const [informationtype, setInformationtype] = React.useState()
    const [policies, setPolicies] = React.useState<Policy[]>([])
    const [categoryUsages, setCategoryUsages] = React.useState<CodeUsage[]>();
    const [listName, setListName] = React.useState();

    const [infoTypeSearchResult, setInfoTypeSearch, infoTypeSearchLoading] = useInfoTypeSearch()

    useAwait(user.wait())
    useAwait(codelist.wait())

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let response = await getCodelistUsageByListName("CATEGORY");
            setCategoryUsages(response.codesInUse);
            setListName(response.listName);
            console.log(categoryUsages);
            setLoading(false);
        };
        fetchData();
    },[listName]);

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
                setInformationtype(infoType)
                setPolicies(policies.content)
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
                <Spinner size={30} />
            ) : (informationTypeId ?
                <React.Fragment>
                    <Banner title={intl.informationType} informationtypeId={informationTypeId} />
                    {!error && informationtype && (
                        <InformationtypeMetadata informationtype={informationtype} policies={policies}
                            expanded={props.match.params.purpose ? [props.match.params.purpose] : []}
                            onSelectPurpose={purpose => props.history.push(`/informationtype/${informationTypeId}/${purpose}`)}
                        />
                    )}

                    {error && (<p>{error}</p>)}
                </React.Fragment>
                : <React.Fragment>
                    <H3 marginTop={theme.sizing.scale200} marginBottom={theme.sizing.scale400}>{intl.informationTypes}</H3>
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
                            <Button type="button" shape={SHAPE.square} onClick={() => props.history.push("/informationtype/create")}>
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
