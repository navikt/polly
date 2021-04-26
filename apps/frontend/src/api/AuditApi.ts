import axios from "axios"
import {AuditAction, AuditItem, AuditLog, Event, ObjectType, PageResponse} from "../constants"
import moment from "moment";
import {env} from "../util/env"

export const getAuditLog = async (id: string) => {
  const auditLog = (await axios.get<AuditLog>(`${env.pollyBaseUrl}/audit/log/${id}`)).data
  auditLog.audits.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
  return auditLog
}

export const getAudits = async (page: number, count: number, table?: ObjectType) => {
  return (await axios.get<PageResponse<AuditItem>>(`${env.pollyBaseUrl}/audit/?pageNumber=${page}&pageSize=${count}` + (table ? `&table=${table}` : ''))).data
}

export const getEvents = async (page: number, count: number, table: ObjectType, action?: AuditAction) => {
  return (await axios.get<PageResponse<Event>>(`${env.pollyBaseUrl}/event/?pageNumber=${page}&pageSize=${count}&table=${table}`
      + (action ? `&action=${action}` : ''))
  ).data
}
