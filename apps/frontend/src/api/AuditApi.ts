import axios from "axios"
import { AuditItem, AuditLog, ObjectType, PageResponse } from "../constants"
import moment from "moment";

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;


export const getAuditLog = async (id: string) => {
  const auditLog = (await axios.get<AuditLog>(`${server_polly}/audit/log/${id}`)).data
  auditLog.audits.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
  return auditLog
}

export const getAudits = async (page: number, count: number, table?: ObjectType) => {
  return (await axios.get<PageResponse<AuditItem>>(`${server_polly}/audit/?pageNumber=${page}&pageSize=${count}` + (table ? `&table=${table}` : ''))).data
}
