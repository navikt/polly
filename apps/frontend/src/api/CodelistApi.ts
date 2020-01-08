import axios from "axios"
import { ListName } from "../service/Codelist"
import { CodeUsage } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getCodelistUsage = async (listname: ListName, code: string) => {
    return (await axios.get<CodeUsage>(`${server_polly}/codelist/usage/find/${listname}/${code}`)).data
}