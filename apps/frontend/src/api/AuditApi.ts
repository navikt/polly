import axios from "axios"
import { AuditLog } from "../constants"
import moment from "moment";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;


export const getAuditLog = async (id: string) => {
    const auditLog = (await axios.get<AuditLog>(`${server_polly}/audit/log/${id}`)).data
    auditLog.audits.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
    return auditLog
}