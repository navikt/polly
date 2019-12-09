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
    const [termSearch, setTermSearch] = useDebouncedState<string>('', 200);
    const [searchResult, setInfoTypeSearchResult] = React.useState<Option[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        const search = async () => {
            if (termSearch && termSearch.length > 2) {
                setLoading(true)
                const res = await searchTerm(termSearch)
                let options: Option[] = res.content.map(term => ({id: term.name, label: term.name + ' - ' + term.description}))
                setInfoTypeSearchResult(options)
                setLoading(false)
            }
        }
        search()
    }, [termSearch])

    return [searchResult, setTermSearch, loading] as [Option[], Dispatch<SetStateAction<string>>, boolean]
}