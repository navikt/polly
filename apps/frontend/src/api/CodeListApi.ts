import axios from "axios";
import {CategoryUsage, InformationType, PageResponse} from "../constants";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getListNameUsages = async (listName: string) => {
    return (await axios.get<CategoryUsage>(`${server_polly}/codelist/usage/find/${listName}`)).data
}