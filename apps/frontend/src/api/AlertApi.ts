import { AlertEvent, AlertEventLevel, AlertEventType, InformationTypeAlert, PageResponse, ProcessAlert } from "../constants"
import axios from "axios"
import { env } from "../util/env"

export const getAlertForInformationType = async (informationTypeId: string) => {
  return (await axios.get<InformationTypeAlert>(`${env.pollyBaseUrl}/alert/informationtype/${informationTypeId}`)).data
}

export const getAlertForProcess = async (processId: string) => {
  return (await axios.get<ProcessAlert>(`${env.pollyBaseUrl}/alert/process/${processId}`)).data
}


export const getAlertEvents = async (page: number, count: number, type?: AlertEventType, level?: AlertEventLevel) => {
  return (await axios.get<PageResponse<AlertEvent>>(`${env.pollyBaseUrl}/alert/events/?pageNumber=${page}&pageSize=${count}`
    + (type ? `&type=${type}` : '')
    + (level ? `&level=${level}` : '')
  )).data
}
