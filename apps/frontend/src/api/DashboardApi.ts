import axios from 'axios'
import { EProcessStatusFilter, IDashboardData } from '../constants'
import { env } from '../util/env'

export const getDashboard = async (filter: EProcessStatusFilter = EProcessStatusFilter.All) => {
  return (await axios.get<IDashboardData>(`${env.pollyBaseUrl}/dash?filter=${filter}`)).data
}
