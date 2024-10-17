import axios from 'axios'
import { Option } from 'baseui/select'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IPageResponse, ITerm } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

export const getTerm = async (termId: string) => {
  return (await axios.get<ITerm>(`${env.pollyBaseUrl}/term/${termId}`)).data
}

export const searchTerm = async (termSearch: string) => {
  return (await axios.get<IPageResponse<ITerm>>(`${env.pollyBaseUrl}/term/search/${termSearch}`))
    .data
}

export const mapTermToOption = (term: ITerm) => ({
  id: term.id,
  label: term.name + ' - ' + term.description,
})

export const useTermSearch = () => {
  const [termSearch, setTermSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (termSearch && termSearch.length > 2) {
        setLoading(true)
        const res = await searchTerm(termSearch)
        const options: Option[] = res.content.map(mapTermToOption)
        setInfoTypeSearchResult(options)
        setLoading(false)
      }
    }
    search()
  }, [termSearch])

  return [searchResult, setTermSearch, loading] as [
    Option[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}
