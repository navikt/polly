import * as React from "react";
import { ReactNode, useEffect } from "react";
import { Spinner } from "baseui/spinner";
import axios from "axios";
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
import { StyledLink } from "baseui/link"
import { Option, Select, TYPE } from "baseui/select"
import { RouteComponentProps } from "react-router-dom"


import InformationtypeMetadata from "../components/InformationType/InformationtypeMetadata/";
import { useAwait, useDebouncedState } from "../util/customHooks"
import { InformationType, PageResponse } from "../constants"
import { codelist, ListName } from "../service/Codelist"
import Banner from "../components/Banner";
import { intl } from "../util/intl/intl"
import { user } from "../service/User";
import { H3 } from "baseui/typography"
import { theme } from "../util/theme"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const reducePolicylist = (list: any) => {
    const temp = list.reduce((acc: any, curr: any) => {
        if (!acc[curr.purposeCode.code]) {
            acc[curr.purposeCode.code] = [curr]
        } else {
            acc[curr.purposeCode.code].push(curr)
        }

        return acc
    }, {})
    return temp
}

const InformationTypeTable = (props: RouteComponentProps) => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<ReactNode[][]>([]);

    const columns = [
        intl.name,
        intl.categories
    ]

    const mapInformationTypeToTable = (infoType: InformationType) => [
        (<StyledLink href="#" onClick={() => props.history.push(`/informationtype/${infoType.id}`)}>{infoType.name}</StyledLink>),
        infoType.categories.map(cat => codelist.getShortname(ListName.CATEGORY, cat.code)).join(', ')
    ]

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await axios
            .get(`${server_polly}/informationtype/?pageNumber=${page - 1}&pageSize=${limit}`)
            .then(res => {
                console.log(res);
                setTotal(res.data.totalElements)
                let content: InformationType[] = res.data.content
                setData(content.map(mapInformationTypeToTable));

            });
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
            <Block display="flex" justifyContent="space-between">
                <H3 marginTop={theme.sizing.scale1000} marginBottom={theme.sizing.scale600}>{intl.informationTypes}</H3>
            </Block>
            <Block height={`${parseInt(theme.sizing.scale4800) * 2.5}px`}>
                <Table columns={columns} data={data} isLoading={loading}/>
            </Block>
            <Block paddingTop={theme.sizing.scale600} display="flex" justifyContent="space-between">
                <StatefulPopover
                    content={({close}) => (
                        <StatefulMenu
                            items={[5, 10, 20, 30, 40, 50, 75, 100].map((i) => ({
                                label: i,
                            }))}
                            onItemSelect={({item}) => {
                                handleLimitChange(item.label);
                                close();
                            }}
                            overrides={{
                                List: {
                                    style: {height: '150px', width: '100px'},
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
                    onPageChange={({nextPage}) => handlePageChange(nextPage)}
                    labels={{prevButton: intl.prevButton, nextButton: intl.nextButton}}
                />
            </Block>
        </React.Fragment>
    )
}


const InformationtypePage = (props: RouteComponentProps<{ id?: string }>) => {
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [informationTypeId, setInformationTypeId] = React.useState(props.match.params.id)
    const [informationtype, setInformationtype] = React.useState()
    const [purposeMap, setPurposeMap] = React.useState([])

    const [infoTypeSearch, setInfoTypeSearch] = useDebouncedState<string>('', 200);
    const [infoTypeSearchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);

    useAwait(user.wait())

    useEffect(() => setInformationTypeId(props.match.params.id), [props.match.params.id]);

    useEffect(() => {
        if (infoTypeSearch && infoTypeSearch.length > 2) {
            axios
            .get(`${server_polly}/informationtype/search/${infoTypeSearch}`)
            .then((res: { data: PageResponse<InformationType> }) => {
                let options: Option[] = res.data.content.map((it: InformationType) => ({id: it.id, label: it.name}))
                return setInfoTypeSearchResult(options)
            })
        }
    }, [infoTypeSearch])

    useEffect(() => {
        const fetchData = async () => {
            if (!informationTypeId) {
                return;
            }
            setLoading(true);
            await axios
            .get(`${server_polly}/informationtype/${informationTypeId}`)
            .then(res => {
                console.log(res)
                setInformationtype(res.data)
            })
            .catch(err => setError(err.message));

            await axios
            .get(`${server_polly}/policy/?informationTypeId=${informationTypeId}&pageSize=250`)
            .then(res => {
                setPurposeMap(reducePolicylist(res.data.content))
            })
            .catch(err => setError(err.message));

            await codelist.wait();
            props.history.push(`/informationtype/${informationTypeId}`)
            setLoading(false);
        };
        fetchData();
    }, [informationTypeId]);

    return (
        <React.Fragment>
            {isLoading ? (
                <Spinner size={30}/>
            ) : (informationTypeId ?
                    <React.Fragment>
                        <Banner title={intl.informationType} informationtypeId={informationTypeId}/>
                        {!error && informationtype && (
                            <InformationtypeMetadata informationtype={informationtype} purposeMap={purposeMap}/>
                        )}

                        {error && (<p>{error}</p>)}
                    </React.Fragment>
                    : <React.Fragment>
                        <Block display="flex" justifyContent="space-between">
                            <Block width="80%">
                                <Select
                                    autoFocus
                                    maxDropdownHeight="400px"
                                    searchable={true}
                                    type={TYPE.search}
                                    options={infoTypeSearchResult}
                                    placeholder={intl.informationTypeSearch}
                                    onInputChange={event => setInfoTypeSearch(event.currentTarget.value)}
                                    onChange={(params: any) => setInformationTypeId(params.value[0].id)}
                                />
                            </Block>
                            <Block>
                                <Button type="button" shape={SHAPE.square} onClick={() => props.history.push("/informationtype/create")}>
                                    <FontAwesomeIcon icon={faPlusCircle}/>&nbsp;{intl.createNew}
                                </Button>
                            </Block>
                        </Block>
                        <InformationTypeTable {...props}/>
                    </React.Fragment>

            )}
        </React.Fragment>
    );
};

export default InformationtypePage;
