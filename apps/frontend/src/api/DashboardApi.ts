import axios from 'axios'
import {env} from '../util/env'
import {DashboardData, ProcessStatusFilter} from '../constants'

export const getDashboard = async (filter: ProcessStatusFilter = ProcessStatusFilter.All) => {
  return (await axios.get<DashboardData>(`${env.pollyBaseUrl}/dash?filter=${filter}`)).data
}
