import axios from 'axios'
import {
  EAlertEventLevel,
  EAlertEventType,
  IAlertEvent,
  IDisclosureAlert,
  IInformationTypeAlert,
  IPageResponse,
  IProcessAlert,
} from '../constants'
import { env } from '../util/env'

export const getAlertForInformationType = async (informationTypeId: string) => {
  return (
    await axios.get<IInformationTypeAlert>(
      `${env.pollyBaseUrl}/alert/informationtype/${informationTypeId}`
    )
  ).data
}

export const getAlertForProcess = async (processId: string) => {
  return (await axios.get<IProcessAlert>(`${env.pollyBaseUrl}/alert/process/${processId}`)).data
}

export const getAlertForDisclosure = async (disclosureId: string) => {
  return (await axios.get<IDisclosureAlert>(`${env.pollyBaseUrl}/alert/disclosure/${disclosureId}`))
    .data
}

export const getAlertEvents = async (
  page: number,
  count: number,
  type?: EAlertEventType,
  level?: EAlertEventLevel,
  processId?: string,
  informationTypeId?: string,
  disclosureId?: string
) => {
  return (
    await axios.get<IPageResponse<IAlertEvent>>(
      `${env.pollyBaseUrl}/alert/events?pageNumber=${page}&pageSize=${count}` +
        (type ? `&type=${type}` : '') +
        (level ? `&level=${level}` : '') +
        (processId ? `&processId=${processId}` : '') +
        (informationTypeId ? `&informationTypeId=${informationTypeId}` : '') +
        (disclosureId ? `&disclosureId=${disclosureId}` : '')
    )
  ).data
}
