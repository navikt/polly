import axios from "axios";
import {DpProcess, DpProcessFormValues, PageResponse, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER} from "../constants";
import {env} from "../util/env";
import {mapBool} from "../util/helper-functions";

export const getAllDpProcesses = async () => {
  const PAGE_SIZE = 100
  const firstPage = await getDpProcessByPageAndSize(0, PAGE_SIZE)
  if (firstPage.pages === 1) {
    return firstPage.content.length > 0 ? [...firstPage.content] : []
  }
  else {
    let AllDpProcesses: DpProcess[] = [...firstPage.content]
    for (let currentPage = 1; currentPage < firstPage.pages; currentPage++) {
      AllDpProcesses = [...AllDpProcesses, ...(await getDpProcessByPageAndSize(currentPage, PAGE_SIZE)).content]
    }
    return AllDpProcesses
  }
}

export const getDpProcessByPageAndSize = async (pageNumber: number, pageSize: number) => {
  return (await axios.get<PageResponse<DpProcess>>(`${env.pollyBaseUrl}/dpprocess?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data
}

export const getDpProcess = async (id: string) => {
  return (await axios.get<DpProcess>(`${env.pollyBaseUrl}/dpprocess/${id}`)).data
}

export const searchDpProcess = async (text: string) => {
  return (await axios.get<PageResponse<DpProcess>>(`${env.pollyBaseUrl}/dpprocess/search/${text}`)).data
}

export const createDpProcess = async (dpProcessFormValues: DpProcessFormValues) => {
  let body = fromValuesToDpProcess(dpProcessFormValues)
  return (await axios.post<DpProcess>(`${env.pollyBaseUrl}/dpprocess`, body)).data
}

export const updateDpProcess = async (id: string, dpProcess: DpProcessFormValues) => {
  return (await axios.put<DpProcess>(`${env.pollyBaseUrl}/dpprocess/${id}`, dpProcess)).data
}

export const deleteDpProcess = async (id: string) => {
  return (await axios.delete<DpProcess>(`${env.pollyBaseUrl}/dpprocess/${id}`)).data
}

export const dpProcessToFormValues = (dpProcess: Partial<DpProcess>): DpProcessFormValues => {
  const {
    affiliation,
    art10,
    art9,
    changeStamp,
    dataProcessingAgreements,
    description,
    end,
    externalProcessResponsible,
    id,
    name,
    purposeDescription,
    retention,
    start,
    subDataProcessing
  } = (dpProcess || {})

  return {
    affiliation: {
      department: affiliation?.department?.code || '',
      subDepartments: affiliation?.subDepartments.map(sd => sd.code) || [],
      productTeams: affiliation?.productTeams || [],
      products: affiliation?.products.map(p => p.code) || [],
    },
    art10: mapBool(art10),
    art9: mapBool(art9),
    dataProcessingAgreements: dataProcessingAgreements || [],
    description: description || '',
    end: end || undefined,
    externalProcessResponsible: (externalProcessResponsible && externalProcessResponsible.code) || undefined,
    subDataProcessing: {
      dataProcessor: mapBool(subDataProcessing?.dataProcessor),
      dataProcessorAgreements: subDataProcessing?.dataProcessorAgreements || [],
      dataProcessorOutsideEU: mapBool(subDataProcessing?.dataProcessorOutsideEU),
      transferGroundsOutsideEU: subDataProcessing?.transferGroundsOutsideEU?.code || undefined,
      transferGroundsOutsideEUOther: subDataProcessing?.transferGroundsOutsideEUOther || '',
      transferCountries: subDataProcessing?.transferCountries || []
    },
    id: id,
    name: name || '',
    purposeDescription: purposeDescription || '',
    retention: {
      retentionMonths: retention?.retentionMonths || 0,
      retentionStart: retention?.retentionStart || '',
    },
    start: start || env.defaultStartDate
  }
}

export const fromValuesToDpProcess = (values: DpProcessFormValues) => {

  return {
    affiliation: values.affiliation,
    art10: values.art10,
    art9: values.art9,
    dataProcessingAgreements: values.dataProcessingAgreements,
    description: values.description,
    end: values.end,
    externalProcessResponsible: values.externalProcessResponsible ? values.externalProcessResponsible : undefined,
    subDataProcessing: {
      ...values.subDataProcessing,
      transferGroundsOutsideEUOther: values.subDataProcessing.transferGroundsOutsideEU !== TRANSFER_GROUNDS_OUTSIDE_EU_OTHER ? undefined : values.subDataProcessing.transferGroundsOutsideEUOther
    },
    id: values.id,
    name: values.name || '',
    purposeDescription: values.purposeDescription,
    retention: values.retention,
    start: values.start
  }
}
