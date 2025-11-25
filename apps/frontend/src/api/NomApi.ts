import axios from 'axios'
import { IOrgEnhet, IPageResponse, TSearchItem } from '../constants'
import { EListName } from '../service/Codelist'
import { env } from '../util/env'

export const getAllNomAvdelinger = async () => {
  return (await axios.get<IPageResponse<IOrgEnhet>>(`${env.pollyBaseUrl}/nom/avdelinger`)).data
    .content
}

export const getSeksjonerForNomAvdeling = async (avdelingId: string) => {
  return (await axios.get<IOrgEnhet[]>(`${env.pollyBaseUrl}/nom/seksjon/avdeling/${avdelingId}`))
    .data
}

export const getAvdelingByNomId = async (id: string) => {
  return (await axios.get<IOrgEnhet>(`${env.pollyBaseUrl}/nom/avdeling/${id}`)).data
}

export const getByNomId = async (id: string) => {
  return (await axios.get<IOrgEnhet>(`${env.pollyBaseUrl}/nom/${id}`)).data
}

export const getAvdelingOptions = async () => {
  const avdelinger = await getAllNomAvdelinger()
  if (avdelinger && avdelinger.length) {
    return avdelinger
      .map((avdeling) => {
        return {
          value: avdeling.id,
          label: avdeling.navn,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }
  return []
}

export const getSeksjonOptions = async (avdelingId: string) => {
  const seksjoner = await getSeksjonerForNomAvdeling(avdelingId)
  if (seksjoner && seksjoner.length) {
    return seksjoner
      .map((seksjon) => {
        return {
          value: seksjon.id,
          label: seksjon.navn,
        }
      })
      .sort((a, b) => a.label.localeCompare(b.label))
  }
  return []
}

export const getAvdelingSearchItem = async (
  search: string,
  list: EListName,
  typeName: string,
  backgroundColor?: string
) => {
  const avdelinger = await getAllNomAvdelinger()

  if (avdelinger && avdelinger.length) {
    return avdelinger
      .filter(
        (avdeling: IOrgEnhet) => avdeling.navn.toLowerCase().indexOf(search.toLowerCase()) >= 0
      )
      .map(
        (avdeling: IOrgEnhet) =>
          ({
            id: avdeling.id,
            sortKey: avdeling.navn,
            label: avdeling.navn,
            type: list,
            typeName: typeName,
            tagColor: backgroundColor || '',
          }) as TSearchItem
      )
  } else {
    return []
  }
}
