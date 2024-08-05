import axios from 'axios'
import { Option } from 'baseui/select'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PageResponse, ProductArea, Team, TeamResource } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

export const getAllTeams = async () => {
  const data = (await axios.get<PageResponse<Team>>(`${env.pollyBaseUrl}/team`)).data
  return data
}

export const getTeam = async (teamId: string) => {
  const data = (await axios.get<Team>(`${env.pollyBaseUrl}/team/${teamId}`)).data
  data.members = data.members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return data
}

export const searchTeam = async (teamSearch: string) => {
  return (await axios.get<PageResponse<Team>>(`${env.pollyBaseUrl}/team/search/${teamSearch}`)).data
}

export const getAllProductAreas = async () => {
  return (await axios.get<PageResponse<ProductArea>>(`${env.pollyBaseUrl}/team/productarea`)).data.content
}

export const getProductArea = async (paId: string) => {
  const data = (await axios.get<ProductArea>(`${env.pollyBaseUrl}/team/productarea/${paId}`)).data
  data.members = data.members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  return data
}

export const searchProductArea = async (search: string) => {
  return (await axios.get<PageResponse<ProductArea>>(`${env.pollyBaseUrl}/team/productarea/search/${search}`)).data
}

export const getResourceById = async (resourceId: string) => {
  return (await axios.get<TeamResource>(`${env.pollyBaseUrl}/team/resource/${resourceId}`)).data
}

export const searchResourceByName = async (resourceName: string) => {
  return (await axios.get<PageResponse<TeamResource>>(`${env.pollyBaseUrl}/team/resource/search/${resourceName}`)).data
}

export const getResourcesByIds = async (ids: string[]) => {
  const resourcesPromise: Promise<any>[] = []
  for (const id of ids) {
    resourcesPromise.push(getResourceById(id))
  }
  return resourcesPromise.length > 0 ? await Promise.all(resourcesPromise) : []
}

export const mapTeamResourceToOption = (teamResource: TeamResource) => ({ id: teamResource.navIdent, label: teamResource.fullName })

export const mapTeamToOption = (team: Team, idx?: number) => ({ id: team.id, label: team.name, idx })

export const useTeamSearch = () => {
  const [teamSearch, setTeamSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (teamSearch && teamSearch.length > 2) {
        setLoading(true)
        const res = await searchTeam(teamSearch)
        let options: Option[] = res.content.map(mapTeamToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamSearch])

  return [searchResult, setTeamSearch, loading] as [Option[], Dispatch<SetStateAction<string>>, boolean]
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
        let options: Option[] = res.content.map(mapTeamResourceToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamResourceSearch])

  return [searchResult, setTeamResourceSearch, loading] as [Option[], Dispatch<SetStateAction<string>>, boolean]
}

export const useAllAreas = () => {
  const [areas, setAreas] = useState<ProductArea[]>([])

  useEffect(() => {
    ;(async () => getAllProductAreas().then(setAreas))()
  }, [])

  return areas
}
