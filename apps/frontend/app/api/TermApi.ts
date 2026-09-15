'use client'

import axios from 'axios'
import { IPageResponse, ITerm } from '../constants'
import { env } from '../util/env'

export const getTerm = async (termId: string) => {
  return (await axios.get<ITerm>(`${env.pollyBaseUrl}/term/${termId}`)).data
}

const searchTerm = async (termSearch: string) => {
  return (await axios.get<IPageResponse<ITerm>>(`${env.pollyBaseUrl}/term/search/${termSearch}`))
    .data
}

export const mapTermToOption = (term: ITerm) => ({
  value: term.id,
  label: term.name + ' - ' + term.description,
})

export const useTermSearchOptions = async (searchParam: string) => {
  if (searchParam && searchParam.length > 2) {
    const terms = (await searchTerm(searchParam)).content
    return terms.map((term: ITerm) => ({
      ...term,
      value: term.id,
      label: mapTermToOption(term).label,
    }))
  }
  return []
}
