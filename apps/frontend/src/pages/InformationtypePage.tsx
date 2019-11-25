import * as React from "react";
import { useEffect } from "react";
import { Spinner } from "baseui/spinner";
import axios from "axios";
import Banner from "../components/Banner";
import InformationtypeMetadata from "../components/InformationType/InformationtypeMetadata/";
import { useDebouncedState } from "../util/customHooks"
import { Option, Select, TYPE } from "baseui/select"
import { InformationType, PageResponse } from "../constants"
import { codelist } from "../service/Codelist"
import { Button, SHAPE } from "baseui/button"
import { Block } from "baseui/block"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { intl } from "../util/intl/intl"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

const reducePolicylist = (list: any) => {
    const temp = list.reduce((acc: any, curr: any) => {
        if (!acc[curr.purposeCode.code]) {
            acc[curr.purposeCode.code] = [curr]
        }
        else {
            acc[curr.purposeCode.code].push(curr)
        }

        return acc
    }, {})
    return temp
}


const InformationtypePage = (props: any) => {
    const [isLoading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [informationTypeId, setInformationTypeId] = React.useState(props.match.params.id)
    const [informationtype, setInformationtype] = React.useState()
    const [purposeMap, setPurposeMap] = React.useState([])

    const [infoTypeSearch, setInfoTypeSearch] = useDebouncedState<string>('', 200);
    const [infoTypeSearchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);

    useEffect(() => {
        if (infoTypeSearch && infoTypeSearch.length > 2) {
            axios
                .get(`${server_polly}/informationtype/search/${infoTypeSearch}`)
                .then((res: { data: PageResponse<InformationType> }) => {
                    let options: Option[] = res.data.content.map((it: InformationType) => ({ id: it.id, label: it.name }))
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
                <Spinner size={30} />
            ) : (informationTypeId ?
                <React.Fragment>
                    <Banner title={intl.informationType} informationtypeId={informationTypeId} />
                    {!error && informationtype && (
                        <InformationtypeMetadata informationtype={informationtype} purposeMap={purposeMap} />
                    )}

                    {error && (<p>{error}</p>)}
                </React.Fragment>
                : <Block display="flex" justifyContent="space-between">
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
                            <FontAwesomeIcon icon={faPlusCircle} />&nbsp;{intl.createNew}
                        </Button>
                    </Block>
                </Block>
                )}
        </React.Fragment>
    );
};

export default InformationtypePage;
