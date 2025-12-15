import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IAaregAvtale, IPageResponse, TOption } from '../constants'
import { useDebouncedState } from '../util'
import { env } from '../util/env'

export const getAaregAvtale = async (avtalenummer: string) => {
  return (await axios.get<IAaregAvtale>(`${env.pollyBaseUrl}/aaregavtale/${avtalenummer}`)).data
}

export const searchAaregAvtale = async (searchParam: string) => {
  return (
    await axios.get<IPageResponse<IAaregAvtale>>(
      `${env.pollyBaseUrl}/aaregavtale/search/${searchParam}`
    )
  ).data
}

export const mapAaregAvtaleToOption = (aaregAvtale: IAaregAvtale) => ({
  value: aaregAvtale.avtalenummer,
  label: aaregAvtale.avtalenummer + ' - ' + aaregAvtale.virksomhet,
})

export const useAaregAvtaleSearch = () => {
  const [aaregAvtaleSearch, setAaregAvtaleSearch] = useDebouncedState<string>('', 200)
  const [searchResult, setInfoTypeSearchResult] = useState<TOption[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const search = async () => {
      if (aaregAvtaleSearch && aaregAvtaleSearch.length > 2) {
        setLoading(true)
        const res = await searchAaregAvtale(aaregAvtaleSearch)
        setInfoTypeSearchResult(res.content.map(mapAaregAvtaleToOption))
        setLoading(false)
      }
    }
    search()
  }, [aaregAvtaleSearch])

  return [searchResult, setAaregAvtaleSearch, loading] as [
    TOption[],
    Dispatch<SetStateAction<string>>,
    boolean,
  ]
}
