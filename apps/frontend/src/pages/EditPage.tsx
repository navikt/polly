import * as React from "react";
import axios from "axios";
import DatasetForm from "../components/Form";
import { Spinner } from "baseui/spinner";
import { Block } from "baseui/block";

import Policy from "../components/Policy";

const server_backend = process.env.REACT_APP_BACKEND_ENDPOINT;
const server_policy = process.env.REACT_APP_POLICY_ENDPOINT;
const server_codelist = process.env.REACT_APP_CODELIST_ENDPOINT;

const reduceList = (list: any) => {
    if (!list) return;
    return list.reduce((acc: any, curr: any) => {
        return [...acc, !curr ? null : curr.code];
    }, []);
};

// const reducePolicies = (list: any) => {
//     if (!list) return;

//     return list.reduce((acc: any, curr: any) => {
//         return [
//             ...acc,
//             {
//                 datasetTitle: curr.dataset.title,
//                 id: curr.policyId,
//                 purposeCode: curr.purpose.code,
//                 legalBasisDescription: curr.legalBasisDescription
//             }
//         ];
//     }, []);
// };

const initializeFormValues = (data: any) => {
    if (!data) return null;

    return {
        title: data.title,
        contentType: data.contentType,
        pi: data.pi,
        categories: reduceList(data.categories),
        provenances: reduceList(data.provenances),
        keywords: data.keywords,
        description: data.description
    };
};

const EditPage = (props: any) => {
    const [dataset, setDataset] = React.useState();
    const [policies, setPolicies] = React.useState();
    const [codelist, setCodelist] = React.useState();
    const [error, setError] = React.useState(null);
    const [isLoading, setLoading] = React.useState(true);

    const handleAxiosError = (error: any) => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            setError(error.response.data);
        } else {
            console.log(error.message);
            setError(error.message);
        }
    };

    const handleGetDatasetResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setDataset(response.data);
        } else {
            setError(response.data);
        }
    };

    const handleGetPolicyResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setPolicies(response.data.content);
        } else {
            setError(response.data);
        }
    };

    const handlePostPolicyResponse = (response: any) => {
        if (!response) return null;

        if (Array.isArray(response.data) && response.data !== null) {
            setPolicies([...policies, ...response.data]);
        }
    };

    const handlePutDatasetResponse = (response: any) => {
        if (typeof response.data === "object" && response.data !== null) {
            setDataset(response.data);
        } else {
            setError(response.data);
        }
    };

    const handleSubmit = async (values: any) => {
        if (!values) return null;

        await axios
            .put(`${server_backend}/${dataset.id}`, values)
            .then(handlePutDatasetResponse);
    };

    const handleAddPolicy = async (values: any) => {
        if (!values) return null; //Error handling mulig
        values.datasetTitle = dataset.title;

        await axios
            .post(`${server_policy}`, [values])
            .then(handlePostPolicyResponse);
    };

    const handleRemovePolicy = async (id: any) => {
        await axios
            .delete(`${server_policy}/${id}`)
            .then(res => {
                //Remove deleted policy from policies state
                setPolicies(
                    policies.filter((policy: any) => policy.policyId !== id)
                );
            })
            .catch(handleAxiosError);
    };

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
                .get(`${server_backend}/${props.match.params.id}`)
                .then(handleGetDatasetResponse)
                .catch(handleAxiosError);

            await axios
                .get(
                    `${server_policy}?datasetId=${props.match.params.id}&pageSize=100`
                )
                .then(handleGetPolicyResponse)
                .catch(handleAxiosError);

            await axios
                .get(`${server_codelist}`)
                .then(handleGetCodelistResponse)
                .catch(handleAxiosError);

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
                    {!error && dataset && policies && codelist ? (
                        <React.Fragment>
                            <DatasetForm
                                formInitialValues={initializeFormValues(
                                    dataset
                                )}
                                isEdit={true}
                                submit={handleSubmit}
                                codelist={codelist}
                            />
                            <Block marginTop="3rem">
                                <Policy
                                    policies={policies}
                                    onAddPolicy={handleAddPolicy}
                                    onRemovePolicy={handleRemovePolicy}
                                />
                            </Block>
                        </React.Fragment>
                    ) : null}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default EditPage;
