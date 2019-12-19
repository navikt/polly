import axios from "axios"
import { PageResponse, Team } from "../constants"
import { default as React, Dispatch, SetStateAction, useEffect } from "react"
import { useDebouncedState } from "../util"
import { Option } from "baseui/select"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const getTeam = async (teamId: string) => {
    return (await axios.get<Team>(`${server_polly}/team/${teamId}`)).data
}

export const searchTeam = async (teamSearch: string) => {
    return (await axios.get<PageResponse<Team>>(`${server_polly}/team/search/${teamSearch}`)).data
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