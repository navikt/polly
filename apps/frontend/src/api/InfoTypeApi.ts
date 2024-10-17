import axios from 'axios'
import queryString from 'query-string'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  IInformationType,
  IInformationTypeShort,
  IInformationtypeFormValues,
  IPageResponse,
  IPolicy,
} from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

export const getInformationTypes = async (page: number, limit: number) => {
  return (
    await axios.get<IPageResponse<IInformationType>>(
      `${env.pollyBaseUrl}/informationtype?pageNumber=${page - 1}&pageSize=${limit}`
    )
  ).data
}

export const getInformationTypesShort = async () => {
  return (
    await axios.get<IPageResponse<IInformationTypeShort>>(
      `${env.pollyBaseUrl}/informationtype/short`
    )
  ).data.content
}

export const getInformationTypesBy = async (params: {
  source?: string
  orgMaster?: string
  productTeam?: string
  productArea?: string
}) => {
  return (
    await axios.get<IPageResponse<IInformationType>>(
      `${env.pollyBaseUrl}/informationtype?${queryString.stringify(params, { skipNull: true })}`
    )
  ).data
}

export const searchInformationType = async (text: string) => {
  return (
    await axios.get<IPageResponse<IInformationType>>(`${env.pollyBaseUrl}/informationtype/search`, {
      params: { name: text },
    })
  ).data
}

export const getInformationType = async (informationTypeId: string) => {
  return (
    await axios.get<IInformationType>(`${env.pollyBaseUrl}/informationtype/${informationTypeId}`)
  ).data
}

export const deleteInformationType = async (informationTypeId: string) => {
  return (await axios.delete<IPolicy>(`${env.pollyBaseUrl}/informationtype/${informationTypeId}`))
    .data
}

export const createInformationType = async (informationType: IInformationtypeFormValues) => {
  return (
    await axios.post<IPageResponse<IInformationType>>(`${env.pollyBaseUrl}/informationtype`, [
      informationType,
    ])
  ).data.content[0]
}

export const updateInformationType = async (informationType: IInformationtypeFormValues) => {
  return (
    await axios.put<IInformationType>(
      `${env.pollyBaseUrl}/informationtype/${informationType.id}`,
      informationType
    )
  ).data
}

export const useInfoTypeSearch = () => {
  const [infoTypeSearch, setInfoTypeSearch] = useDebouncedState<string>('', 200)
  const [infoTypeSearchResult, setInfoTypeSearchResult] = useState<IInformationTypeShort[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (infoTypeSearch && infoTypeSearch.length > 2) {
        setLoading(true)
        const res = await searchInformationType(infoTypeSearch)
        setInfoTypeSearchResult(res.content)
        setLoading(false)
      }
    }
    search()
  }, [infoTypeSearch])

  return [infoTypeSearchResult, setInfoTypeSearch, loading] as [
    IInformationTypeShort[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}

export const mapInfoTypeToFormVals = (
  data: Partial<IInformationType>
): IInformationtypeFormValues => {
  return {
    id: data.id,
    name: data.name || '',
    term: data.term || '',
    sensitivity: data.sensitivity?.code || '',
    categories: data?.categories?.map((c) => c.code) || [],
    sources: data?.sources?.map((c) => c.code) || [],
    productTeams: data.productTeams || [],
    keywords: data.keywords || [],
    description: data.description || '',
    orgMaster: data.orgMaster?.code || '',
  }
}
