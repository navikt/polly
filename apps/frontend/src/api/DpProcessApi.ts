import axios from "axios";
import {DpProcess, PageResponse} from "../constants";
import {env} from "../util/env";

export const getAllDpProcesses = async () => {
  const PAGE_SIZE = 20
  const firstPage = await getDpProcessByPageAndSize(0, PAGE_SIZE)
  if (firstPage.pages === 0) {
    return [...firstPage.content]
  } else {
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

export const createDpProcess = async (dpProcess: DpProcess) => {
  return (await axios.post<DpProcess>(`${env.pollyBaseUrl}/dpprocess`, dpProcess)).data
}

export const updateDpProcess = async (id: string, dpProcess: DpProcess) => {
  return (await axios.put<DpProcess>(`${env.pollyBaseUrl}/dpprocess/${id}`, dpProcess)).data
}

export const deleteDpProcess = async (id: string) => {
  return (await axios.delete<DpProcess>(`${env.pollyBaseUrl}/dpprocess/${id}`)).data
}
