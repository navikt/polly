import * as React from "react";
import { Spinner } from "baseui/spinner";
import axios from "axios";
import { Block } from 'baseui/block'
import Banner from "../components/Banner";
import { Card } from "baseui/card";
import InformationtypeMetadata from "../components/InformationType/InformationtypeMetadata/";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;
const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;

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
    console.log(temp, "TEEEEEEEMP")
    return temp
}


const InformationtypePage = (props: any) => {
    const [isLoading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [codelist, setCodelist] = React.useState();
    const [informationtype, setInformationtype] = React.useState()
    const [purposeMap, setPurposeMap] = React.useState([])


    const handleGetCodelistResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setCodelist(response.data);
        } else {
            setError(response.data);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await axios
                .get(`${server_polly}/informationtype/${props.match.params.id}`)
                .then(res => {
                    console.log(res)
                    setInformationtype(res.data)
                })
                .catch(err => setError(err.message));

            await axios
                .get(`${server_polly}/policy/?informationTypeId=${props.match.params.id}&pageSize=250`)
                .then(res => {
                    console.log(res, "POLIC")
                    setPurposeMap(reducePolicylist(res.data.content))
                })
                .catch(err => setError(err.message));

            await axios
                .get(`${server_codelist}`)
                .then((res => setCodelist(res.data)))
                .catch((err) => setError(err.message));

            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <React.Fragment>
            {isLoading ? (
                <Spinner size={30} />
            ) : (
                    <React.Fragment>
                        <Banner title="Opplysningstype" />
                        {!error && informationtype && (
                            <InformationtypeMetadata informationtype={informationtype} purposeMap={purposeMap} codelist={codelist} />
                        )}

                        {error && (<p>{error}</p>)}
                    </React.Fragment>
                )}
        </React.Fragment>
    );
};

export default InformationtypePage;
