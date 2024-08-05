import axios from 'axios'
import { Option } from 'baseui/select'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AaregAvtale, PageResponse } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

export const getAaregAvtale = async (avtalenummer: string) => {
  return (await axios.get<AaregAvtale>(`${env.pollyBaseUrl}/aaregavtale/${avtalenummer}`)).data
}

export const searchAaregAvtale = async (searchParam: string) => {
  return (await axios.get<PageResponse<AaregAvtale>>(`${env.pollyBaseUrl}/aaregavtale/search/${searchParam}`)).data
}

export const mapAaregAvtaleToOption = (aaregAvtale: AaregAvtale) => ({ id: aaregAvtale.avtalenummer, label: aaregAvtale.avtalenummer + ' - ' + aaregAvtale.virksomhet })

export const useAaregAvtaleSearch = () => {
  const [aaregAvtaleSearch, setAaregAvtaleSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<Option[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (aaregAvtaleSearch && aaregAvtaleSearch.length > 2) {
        setLoading(true)
        const res = await searchAaregAvtale(aaregAvtaleSearch)
        setInfoTypeSearchResult(res.content)
        setLoading(false)
      }
    }
    search()
  }, [aaregAvtaleSearch])

  return [searchResult, setAaregAvtaleSearch, loading] as [Option[], Dispatch<SetStateAction<string>>, boolean]
}
