'use client'

import axios from 'axios'
import { IDatabehandler, IDatabehandlerFormValues, IPageResponse } from '../constants'
import { env } from '../util/env'
import { mapBool } from '../util/helper-functions'

export const getDatabehandler = async (databehandlerId: string) => {
  return (await axios.get<IDatabehandler>(`${env.pollyBaseUrl}/databehandler/${databehandlerId}`))
    .data
}

export const getDatabehandlereByIds = async (ids: string[]) => {
  const databehandlerePromise: Promise<IDatabehandler>[] = []
  for (const id of ids) {
    databehandlerePromise.push(getDatabehandler(id))
  }
  return databehandlerePromise.length > 0 ? await Promise.all(databehandlerePromise) : []
}

export const getDatabehandlereByPageAndPageSize = async (pageNumber: number, pageSize: number) => {
  return (
    await axios.get<IPageResponse<IDatabehandler>>(
      `${env.pollyBaseUrl}/databehandler?pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
  ).data
}

export const createDatabehandler = async (databehandler: IDatabehandlerFormValues) => {
  const body = convertFormValuesToDatabehandler(databehandler)
  return (await axios.post<IDatabehandler>(`${env.pollyBaseUrl}/databehandler`, body)).data
}

export const updateDatabehandler = async (databehandler: IDatabehandlerFormValues) => {
  const body = convertFormValuesToDatabehandler(databehandler)
  return (await axios.put<IDatabehandler>(`${env.pollyBaseUrl}/databehandler/${body.id}`, body))
    .data
}

export const deleteDatabehandler = async (databehandlerId: string) => {
  return (
    await axios.delete<IDatabehandler>(`${env.pollyBaseUrl}/databehandler/${databehandlerId}`)
  ).data
}

export const convertDatabehandlerToFormValues = (
  values?: Partial<IDatabehandler>
): IDatabehandlerFormValues => {
  const {
    id,
    navn,
    avtalereferanse,
    avtaleeier,
    fagansvarlig,
    merknad,

    behandlingUtenforEuEos,
    overforingsgrunnlagUtenforEuEos,
    overforingsgrunnlagUtenforEuEosAnnet,
    landDataOverforesTil,
    version,
  } = values || {}

  return {
    id: id || '',
    // Optimistisk låsing: ta vare på versjonen vi leste, slik at den kan sendes ved lagring
    version: version,
    navn: navn || '',
    avtalereferanse: avtalereferanse || '',
    avtaleeier: avtaleeier || '',
    fagansvarlig: fagansvarlig || [],
    merknad: merknad || '',

    behandlingUtenforEuEos: mapBool(behandlingUtenforEuEos),
    overforingsgrunnlagUtenforEuEos: overforingsgrunnlagUtenforEuEos?.code || undefined,
    overforingsgrunnlagUtenforEuEosAnnet: overforingsgrunnlagUtenforEuEosAnnet || '',
    landDataOverforesTil: landDataOverforesTil || [],
  }
}

const convertFormValuesToDatabehandler = (values: IDatabehandlerFormValues) => {
  return {
    id: values.id,
    // Optimistisk låsing: versjonen klienten sist leste. Backend svarer 409 hvis den er utdatert.
    version: values.version,
    navn: values.navn,
    avtalereferanse: values.avtalereferanse,
    avtaleeier: values.avtaleeier,
    fagansvarlig: values.fagansvarlig || [],
    merknad: values.merknad,

    behandlingUtenforEuEos: values.behandlingUtenforEuEos,
    overforingsgrunnlagUtenforEuEos: values.overforingsgrunnlagUtenforEuEos,
    overforingsgrunnlagUtenforEuEosAnnet: values.overforingsgrunnlagUtenforEuEosAnnet,
    landDataOverforesTil: values.landDataOverforesTil,
  }
}
