import axios from "axios"
import {PageResponse, Team, TeamResource} from "../constants"
import {default as React, Dispatch, SetStateAction, useEffect} from "react"
import {useDebouncedState} from "../util"
import {Option} from "baseui/select"
import {env} from "../util/env"

export const getAllTeams = async () => {
    const data = (await axios.get<PageResponse<Team>>(`${env.pollyBaseUrl}/team`)).data
    return data
}

export const getTeam = async (teamId: string) => {
    const data = (await axios.get<Team>(`${env.pollyBaseUrl}/team/${teamId}`)).data
    data.members = data.members.sort((a,b)=> (a.name || '').localeCompare(b.name || ''))
    return data
}

export const searchTeam = async (teamSearch: string) => {
    return (await axios.get<PageResponse<Team>>(`${env.pollyBaseUrl}/team/search/${teamSearch}`)).data
}

export const getResourceById = async (resourceId: string) => {
  return (await axios.get<TeamResource>(`${env.pollyBaseUrl}/team/resource/${resourceId}`)).data
}

export const getResourceByName = async (resourceName: string) => {
  return (await axios.get<PageResponse<TeamResource>>(`${env.pollyBaseUrl}/team/resource/search/${resourceName}`)).data
}

export const mapTeamResourceToOption = (teamResource: TeamResource) => ({id: teamResource.navIdent, label: teamResource.fullName})

export const mapTeamToOption = (team: Team) => ({id: team.id, label: team.name})

export const useTeamSearch = () => {
    const [teamSearch, setTeamSearch] = useDebouncedState<string>('', 200);
    const [searchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

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
  const [teamResourceSearch, setTeamResourceSearch] = useDebouncedState<string>('', 200);
  const [searchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const search = async () => {
      if (teamResourceSearch && teamResourceSearch.length > 2) {
        setLoading(true)
        const res = await getResourceByName(teamResourceSearch)
        let options: Option[] = res.content.map(mapTeamResourceToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [teamResourceSearch])

  return [searchResult, setTeamResourceSearch, loading] as [Option[], Dispatch<SetStateAction<string>>, boolean]
}
