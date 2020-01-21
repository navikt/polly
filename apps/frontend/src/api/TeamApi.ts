import axios from "axios"
import { PageResponse, Team } from "../constants"
import { default as React, Dispatch, SetStateAction, useEffect } from "react"
import { useDebouncedState } from "../util"
import { Option } from "baseui/select"
import { env } from "../util/env"

export const getTeam = async (teamId: string) => {
    const data = (await axios.get<Team>(`${env.pollyBaseUrl}/team/${teamId}`)).data
    data.members = data.members.sort((a,b)=> a.name.localeCompare(b.name))
    return data
}

export const searchTeam = async (teamSearch: string) => {
    return (await axios.get<PageResponse<Team>>(`${env.pollyBaseUrl}/team/search/${teamSearch}`)).data
}

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
