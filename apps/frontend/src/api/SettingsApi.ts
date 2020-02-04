import axios from "axios"
import { Settings } from "../constants"
import { env } from "../util/env"

export const getSettings = async () => {
  return (await axios.get<Settings>(`${env.pollyBaseUrl}/settings`)).data
}

export const writeSettings = async (settings: Settings) => {
  return (await axios.post<Settings>(`${env.pollyBaseUrl}/settings`, settings)).data
}
