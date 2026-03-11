import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IPageResponse, IProductArea, ITeam, ITeamResource, TOption } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

const defaultTeam = (teamId: string): ITeam => ({
  id: teamId,
  name: teamId,
  description: '',
  productAreaId: undefined,
  slackChannel: undefined,
  tags: [],
  members: [],
})

const teamPromiseCache = new Map<string, Promise<ITeam>>()

export const getAllTeams = async () => {
  const data = (await axios.get<IPageResponse<ITeam>>(`${env.pollyBaseUrl}/team`)).data
  return data
}

export const getTeam = async (teamId: string) => {
  const cached = teamPromiseCache.get(teamId)
  if (cached) return cached

  const promise = (async () => {
    try {
      const data = (await axios.get<ITeam>(`${env.pollyBaseUrl}/team/${teamId}`)).data
      data.members = data.members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return defaultTeam(teamId)
      }
      teamPromiseCache.delete(teamId)
      throw error
    }
  })()

  teamPromiseCache.set(teamId, promise)
  return promise
}

export const searchTeam = async (teamSearch: string) => {
  return (await axios.get<IPageResponse<ITeam>>(`${env.pollyBaseUrl}/team/search/${teamSearch}`))
    .data
}

export const getAllProductAreas = async () => {
  return (await axios.get<IPageResponse<IProductArea>>(`${env.pollyBaseUrl}/team/productarea`)).data
    .content
}

export const getProductArea = async (paId: string) => {
  const data = (await axios.get<IProductArea>(`${env.pollyBaseUrl}/team/productarea/${paId}`)).data
  data.members = data.members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return data
}

export const searchProductArea = async (search: string) => {
  return (
    await axios.get<IPageResponse<IProductArea>>(
      `${env.pollyBaseUrl}/team/productarea/search/${search}`
    )
  ).data
}

export const getResourceById = async (resourceId: string) => {
  return (await axios.get<ITeamResource>(`${env.pollyBaseUrl}/team/resource/${resourceId}`)).data
}

export const searchResourceByName = async (resourceName: string) => {
  return (
    await axios.get<IPageResponse<ITeamResource>>(
      `${env.pollyBaseUrl}/team/resource/search/${resourceName}`
    )
  ).data
}

export const getResourcesByIds = async (ids: string[]) => {
  const resourcesPromise: Promise<any>[] = []
  for (const id of ids) {
    resourcesPromise.push(getResourceById(id))
  }
  return resourcesPromise.length > 0 ? await Promise.all(resourcesPromise) : []
}

export const mapTeamResourceToOption = (teamResource: ITeamResource) => ({
  value: teamResource.navIdent,
  label: teamResource.fullName,
})

export const mapTeamToOption = (team: ITeam, index?: number) => ({
  value: team.id,
  label: team.name,
  index,
})

export const useTeamSearch = () => {
  const [teamSearch, setTeamSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<TOption[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (teamSearch && teamSearch.length > 2) {
        setLoading(true)
        const res = await searchTeam(teamSearch)
        const options: TOption[] = res.content.map(mapTeamToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamSearch])

  return [searchResult, setTeamSearch, loading] as [
    TOption[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}

export const useTeamSearchOptions = async (searchParam: string) => {
  if (searchParam && searchParam.length > 2) {
    const teams = (await searchTeam(searchParam)).content

    const searchResult = teams.map((team: ITeam) => {
      return {
        ...team,
        value: team.id,
        label: team.name,
      }
    })

    return searchResult
  }

  return []
}

export const useTeamResourceSearchOptions = async (searchParam: string) => {
  if (searchParam && searchParam.length > 2) {
    const teams = (await searchResourceByName(searchParam)).content
    return teams.map(mapTeamResourceToOption)
  }
  return []
}

export const useTeamResourceSearch = () => {
  const [teamResourceSearch, setTeamResourceSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<TOption[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (teamResourceSearch && teamResourceSearch.length > 2) {
        setLoading(true)
        const res = await searchResourceByName(teamResourceSearch)
        const options: TOption[] = res.content.map(mapTeamResourceToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamResourceSearch])

  return [searchResult, setTeamResourceSearch, loading] as [
    TOption[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}

export const useAllAreas = () => {
  const [areas, setAreas] = useState<IProductArea[]>([])

  useEffect(() => {
    ;(async () => getAllProductAreas().then(setAreas))()
  }, [])

  return areas
}
