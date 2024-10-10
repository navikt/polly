import axios from 'axios'
import { ICategoryUsage, ICodeUsage } from '../constants'
import { EListName, IAllCodelists, ICode, ICountryCode } from '../service/Codelist'
import { env } from '../util/env'

// refresh will force backend to re-read codelists from db, due to caching and multibackend
export const getAllCodelists = async (refresh?: boolean) =>
  await axios.get<IAllCodelists>(
    `${env.pollyBaseUrl}/codelist?refresh=${refresh ? 'true' : 'false'}`
  )

export const getCodelistUsageByListName = async (listname: string) => {
  return (await axios.get<ICategoryUsage>(`${env.pollyBaseUrl}/codelist/usage/find/${listname}`))
    .data
}

export const getCodelistUsage = async (listname: EListName, code: string) => {
  return (
    await axios.get<ICodeUsage>(`${env.pollyBaseUrl}/codelist/usage/find/${listname}/${code}`)
  ).data
}

export const replaceCodelistUsage = async (
  listname: EListName,
  oldCode: string,
  newCode: string
) => {
  return (
    await axios.post<ICodeUsage>(`${env.pollyBaseUrl}/codelist/usage/replace`, {
      list: listname,
      oldCode,
      newCode,
    })
  ).data
}

export const createCodelist = async (code: ICode) => {
  return axios.post<ICode[]>(`${env.pollyBaseUrl}/codelist`, [code])
}

export const updateCodelist = async (code: ICode) => {
  return axios.put<ICode[]>(`${env.pollyBaseUrl}/codelist`, [code])
}

export const deleteCodelist = async (list: string, code: string) => {
  return axios.delete(`${env.pollyBaseUrl}/codelist/${list}/${code}`)
}

export const getAllCountries = async () =>
  (await axios.get<ICountryCode[]>(`${env.pollyBaseUrl}/codelist/countries`)).data
export const getCountriesOutsideEUEEA = async () =>
  (await axios.get<ICountryCode[]>(`${env.pollyBaseUrl}/codelist/countriesoutsideeea`)).data
