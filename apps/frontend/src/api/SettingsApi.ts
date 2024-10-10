import axios from 'axios'
import { ISettings } from '../constants'
import { env } from '../util/env'

export const getSettings = async () => {
  return (await axios.get<ISettings>(`${env.pollyBaseUrl}/settings`)).data
}

export const writeSettings = async (settings: ISettings) => {
  return (await axios.post<ISettings>(`${env.pollyBaseUrl}/settings`, settings)).data
}
