import axios from "axios"
import {AllCodelists, Code, CountryCode, ListName} from "../service/Codelist"
import {CategoryUsage, CodeUsage} from "../constants"
import {env} from "../util/env"

// refresh will force backend to re-read codelists from db, due to caching and multibackend
export const getAllCodelists = async (refresh?: boolean) => await axios.get<AllCodelists>(`${env.pollyBaseUrl}/codelist?refresh=${refresh ? 'true' : 'false'}`)

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

export const getAllCountries = async () => (await axios.get<CountryCode[]>(`${env.pollyBaseUrl}/codelist/countries`)).data
export const getCountriesOutsideEUEEA = async () => (await axios.get<CountryCode[]>(`${env.pollyBaseUrl}/codelist/countriesoutsideeea`)).data
