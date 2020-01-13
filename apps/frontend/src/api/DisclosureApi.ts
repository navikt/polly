import axios from "axios";
import { PageResponse, DisclosureFormValues, Disclosure } from "../constants";
import { createDocument, updateDocument } from "./DocumentApi"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getAllDisclosures = async () => {
    return (await axios.get<PageResponse<Disclosure>>(`${server_polly}/disclosure?pageSize=250`)).data.content;
};

export const getDisclosure = async (disclosureId: string) => {
    return (await axios.get<Disclosure>(`${server_polly}/disclosure/${disclosureId}`)).data;
};

export const getDisclosuresByRecipient = async (recipient: string) => {
    return (await axios.get<PageResponse<Disclosure>>(`${server_polly}/disclosure/?recipient=${recipient}`)).data.content
}

export const getDisclosuresByInformationTypeId = async (informationTypeId: string) => {
    return (await axios.get<PageResponse<Disclosure>>(`${server_polly}/disclosure/?informationTypeId=${informationTypeId}&pageSize=250`)).data.content
}

export const createDisclosure = async (disclosure: DisclosureFormValues) => {
    let doc = disclosure.document
    if (doc) {
        const createDoc = await createDocument(doc)
        disclosure.documentId = createDoc.id
    }
    let body = mapDisclosureFromForm(disclosure);
    return (await axios.post<Disclosure>(`${server_polly}/disclosure`, body)).data;
};

export const updateDisclosure = async (disclosure: DisclosureFormValues) => {
    let doc = disclosure.document
    if (doc && doc.id) {
        await updateDocument(doc)
        disclosure.documentId = doc.id
    } else if (doc) {
        const createDoc = await createDocument(doc)
        disclosure.documentId = createDoc.id
    }
    console.log(disclosure, "DISCL")
    let body = mapDisclosureFromForm(disclosure);
    return (
        await axios.put<Disclosure>(`${server_polly}/disclosure/${body.id}`, body)
    ).data;
};

export const deleteDisclosure = async (disclosureId: string) => {
    return (await axios.delete<Disclosure>(`${server_polly}/disclosure/${disclosureId}`)).data
}

export const mapDisclosureFromForm = (values: DisclosureFormValues) => {
    return {
        id: values.id,
        recipient: values.recipient,
        recipientPurpose: '-',
        documentId: values.documentId,
        description: values.description,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end
    };
};
