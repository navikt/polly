'use client'

import axios from 'axios'
import { IAaregAvtale, IPageResponse } from '../constants'
import { env } from '../util/env'

export const searchAaregAvtale = async (searchParam: string) => {
  return (
    await axios.get<IPageResponse<IAaregAvtale>>(
      `${env.pollyBaseUrl}/aaregavtale/search/${searchParam}`
    )
  ).data
}
