import axios from "axios"
import { AllCodelists, Code, ListName } from "../service/Codelist"
import { CategoryUsage, CodeUsage } from "../constants"
import { env } from "../util/env"

export const getAllCodelists = async () => await axios.get<AllCodelists>(`${env.pollyBaseUrl}/codelist`)

export const getCodelistUsageByListName = async (listname: string) => {
  return (await axios.get<CategoryUsage>(`${env.pollyBaseUrl}/codelist/usage/find/${listname}`)).data
}

export const getCodelistUsage = async (listname: ListName, code: string) => {
  return (await axios.get<CodeUsage>(`${env.pollyBaseUrl}/codelist/usage/find/${listname}/${code}`)).data
}

export const replaceCodelistUsage = async (listname: ListName, oldCode: string, newCode: string) => {
  return (await axios.post<CodeUsage>(`${env.pollyBaseUrl}/codelist/usage/replace`, {list: listname, oldCode, newCode})).data
}

export const createCodelist = async (code: Code) => {
  return axios.post<Code[]>(`${env.pollyBaseUrl}/codelist`, [code])
}

export const updateCodelist = async (code: Code) => {
  return axios.put<Code[]>(`${env.pollyBaseUrl}/codelist`, [code])
}

export const deleteCodelist = async (list: string, code: string) => {
  return axios.delete(`${env.pollyBaseUrl}/codelist/${list}/${code}`)
}
