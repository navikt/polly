import axios from "axios";
import { PageResponse, DisclosureFormValues, Disclosure } from "../constants";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getAllDisclosures = async () => {
    return (await axios.get(`${server_polly}/disclosure`)).data.content;
};

export const getDisclosuresByRecipient = async (recipient: string) => {
    return (await axios.get(`${server_polly}/disclosure/?recipient=${recipient}`)).data.content
}

export const createDisclosure = async (disclosure: DisclosureFormValues) => {
    let body = mapDisclosureFromForm(disclosure);
    return (await axios.post(`${server_polly}/disclosure`, body)).data.content;
};

export const mapDisclosureFromForm = (values: DisclosureFormValues) => {
    return {
        recipient: values.recipient,
        recipientPurpose: values.recipientPurpose,
        informationTypes:
            values.informationTypes && values.informationTypes.map(i => i.id),
        description: values.description,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end
    };
};
