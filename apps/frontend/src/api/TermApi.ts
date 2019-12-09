import axios from "axios"
import { PageResponse, Term } from "../constants"
import { default as React, Dispatch, SetStateAction, useEffect } from "react"
import { useDebouncedState } from "../util"
import { Option } from "baseui/select"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const searchTerm = async (termSearch: string) => {
    return (await axios.get<PageResponse<Term>>(`${server_polly}/term/search/${termSearch}`)).data
}

export const useTermSearch = () => {
    const [infoTypeSearch, setSearch] = useDebouncedState<string>('', 200);
    const [searchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const search = async () => {
            if (infoTypeSearch && infoTypeSearch.length > 2) {
                setLoading(true)
                const res = await searchTerm(infoTypeSearch)
                let options: Option[] = res.content.map(term => ({id: term.name, label: term.name + ' - ' + term.description}))
                setInfoTypeSearchResult(options)
                setLoading(false)
            }
        }
        search()
    }, [infoTypeSearch])

    return [searchResult, setSearch, loading] as [Option[], Dispatch<SetStateAction<string>>, boolean]
}