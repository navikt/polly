import * as React from "react";
import { ReactNode, useEffect } from "react";
import { Spinner } from "baseui/spinner";
import { Button, KIND, SHAPE } from "baseui/button"
import { Block } from "baseui/block"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Table } from "baseui/table"
import { StatefulPopover } from "baseui/popover"
import { StatefulMenu } from "baseui/menu"
import { PLACEMENT } from "baseui/tooltip"
import { TriangleDown } from "baseui/icon"
import { Pagination } from "baseui/pagination"
import { Select, TYPE } from "baseui/select"
import { RouteComponentProps } from "react-router-dom"


import InformationtypeMetadata from "../components/InformationType/InformationtypeMetadata/";
import { intl, theme, useAwait } from "../util"
import { InformationType, Policy } from "../constants"
import { codelist, ListName } from "../service/Codelist"
import Banner from "../components/Banner";
import { user } from "../service/User";
import { H3, H6 } from "baseui/typography"
import { getInformationType, getInformationTypes, getPoliciesForInformationType, useInfoTypeSearch } from "../api"
import RouteLink from "../components/common/RouteLink"

export type PurposeMap = { [purpose: string]: Policy[] }

const reducePolicylist = (list: Policy[]) => {
    return list.reduce((acc: PurposeMap, curr) => {
        if (!acc[curr.purposeCode.code]) {
            acc[curr.purposeCode.code] = [curr]
        } else {
            acc[curr.purposeCode.code].push(curr)
        }

        return acc
    }, {})
}

const InformationTypeTable = (props: RouteComponentProps) => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(25);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<ReactNode[][]>([]);

    const columns = [
        intl.name,
        intl.categories
    ]

    const mapInformationTypeToTable = (infoType: InformationType) => [
        <RouteLink href={`/informationtype/${infoType.id}`}>{infoType.name}</RouteLink>,
        infoType.categories.map(cat => codelist.getShortname(ListName.CATEGORY, cat.code)).join(', ')
    ]

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let data = await getInformationTypes(page, limit)
            setTotal(data.totalElements)
            setData(data.content.map(mapInformationTypeToTable));
            setLoading(false);
        };
        fetchData();
    }, [page, limit]);

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1) {
            return;
        }
        if (nextPage > Math.ceil(total / limit)) {
            return;
        }
        setPage(nextPage);
    };

    const handleLimitChange = (nextLimit: number) => {
        const nextPageNum = Math.ceil(total / nextLimit);
        if (nextPageNum < page) {
            setLimit(nextLimit);
            setPage(nextPageNum);
        } else {
            setLimit(nextLimit);
        }
    };

    return (
        <React.Fragment>
            <H6 display="flex" justifyContent="space-between" marginBottom={theme.sizing.scale400} paddingLeft={theme.sizing.scale200}>{intl.all} {intl.informationTypes}</H6>
            <Table columns={columns} data={data} isLoading={loading} />
            <Block paddingTop={theme.sizing.scale600} display="flex" justifyContent="space-between">
                <StatefulPopover
                    content={({ close }) => (
                        <StatefulMenu
                            items={[5, 10, 15, 20, 25, 50, 75, 100].map((i) => ({
                                label: i,
                            }))}
                            onItemSelect={({ item }) => {
                                handleLimitChange(item.label);
                                close();
                            }}
                            overrides={{
                                List: {
                                    style: { height: '150px', width: '100px' },
                                },
                            }}
                        />
                    )}
                    placement={PLACEMENT.bottom}
                >
                    <Button kind={KIND.tertiary} endEnhancer={TriangleDown}>
                        {`${limit} ${intl.rows}`}
                    </Button>
                </StatefulPopover>
                <Pagination
                    currentPage={page}
                    numPages={Math.ceil(total / limit)}
                    onPageChange={({ nextPage }) => handlePageChange(nextPage)}
                    labels={{ prevButton: intl.prevButton, nextButton: intl.nextButton }}
                />
            </Block>
        </React.Fragment>
    )
}


const InformationtypePage = (props: RouteComponentProps<{ id?: string, purpose?: string }>) => {
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [informationTypeId, setInformationTypeId] = React.useState(props.match.params.id)
    const [informationtype, setInformationtype] = React.useState()
    const [purposeMap, setPurposeMap] = React.useState<PurposeMap>({})

    const [infoTypeSearchResult, setInfoTypeSearch, infoTypeSearchLoading] = useInfoTypeSearch()

    useAwait(user.wait())
    useAwait(codelist.wait())

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
                setPurposeMap(reducePolicylist(policies.content))
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
                        <InformationtypeMetadata informationtype={informationtype} purposeMap={purposeMap}
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
                    <InformationTypeTable {...props} />
                </React.Fragment>

                )}
        </React.Fragment>
    );
};

export default InformationtypePage;
