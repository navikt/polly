import axios from 'axios'
import { Option } from 'baseui/select'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IPageResponse, IProductArea, ITeam, ITeamResource } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

export const getAllTeams = async () => {
  const data = (await axios.get<IPageResponse<ITeam>>(`${env.pollyBaseUrl}/team`)).data
  return data
}

export const getTeam = async (teamId: string) => {
  const data = (await axios.get<ITeam>(`${env.pollyBaseUrl}/team/${teamId}`)).data
  data.members = data.members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return data
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
  id: teamResource.navIdent,
  label: teamResource.fullName,
})

export const mapTeamToOption = (team: ITeam, idx?: number) => ({
  id: team.id,
  label: team.name,
  idx,
})

export const useTeamSearch = () => {
  const [teamSearch, setTeamSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (teamSearch && teamSearch.length > 2) {
        setLoading(true)
        const res = await searchTeam(teamSearch)
        const options: Option[] = res.content.map(mapTeamToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamSearch])

  return [searchResult, setTeamSearch, loading] as [
    Option[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}

export const useTeamResourceSearch = () => {
  const [teamResourceSearch, setTeamResourceSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (teamResourceSearch && teamResourceSearch.length > 2) {
        setLoading(true)
        const res = await searchResourceByName(teamResourceSearch)
        const options: Option[] = res.content.map(mapTeamResourceToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamResourceSearch])

  return [searchResult, setTeamResourceSearch, loading] as [
    Option[],
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
