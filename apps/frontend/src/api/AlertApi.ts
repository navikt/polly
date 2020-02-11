import { InformationTypeAlert, ProcessAlert } from "../constants"
import axios from "axios"
import { env } from "../util/env"

export const getAlertForInformationType = async (informationTypeId: string) => {
  return (await axios.get<InformationTypeAlert>(`${env.pollyBaseUrl}/alert/informationtype/${informationTypeId}`)).data
}

export const getAlertForProcess = async (processId: string) => {
  return (await axios.get<ProcessAlert>(`${env.pollyBaseUrl}/alert/process/${processId}`)).data
}
