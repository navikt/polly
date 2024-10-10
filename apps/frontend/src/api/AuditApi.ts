import axios from 'axios'
import moment from 'moment'
import {
  EAuditAction,
  EObjectType,
  IAuditItem,
  IAuditLog,
  IPageResponse,
  TEvent,
} from '../constants'
import { env } from '../util/env'

export const getAuditLog = async (id: string) => {
  const auditLog = (await axios.get<IAuditLog>(`${env.pollyBaseUrl}/audit/log/${id}`)).data
  auditLog.audits.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
  return auditLog
}

export const getAudits = async (page: number, count: number, table?: EObjectType) => {
  return (
    await axios.get<IPageResponse<IAuditItem>>(
      `${env.pollyBaseUrl}/audit?pageNumber=${page}&pageSize=${count}` +
        (table ? `&table=${table}` : '')
    )
  ).data
}

export const getEvents = async (
  page: number,
  count: number,
  table: EObjectType,
  action?: EAuditAction
) => {
  return (
    await axios.get<IPageResponse<TEvent>>(
      `${env.pollyBaseUrl}/event?pageNumber=${page}&pageSize=${count}&table=${table}` +
        (action ? `&action=${action}` : '')
    )
  ).data
}
