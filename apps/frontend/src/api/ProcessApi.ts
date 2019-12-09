import axios from "axios"
import { ProcessPurposeCount } from "../constants"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getProcessPurposeCount = async () => {
    return (await axios.get<ProcessPurposeCount>(`${server_polly}/process/count/purpose`)).data
}