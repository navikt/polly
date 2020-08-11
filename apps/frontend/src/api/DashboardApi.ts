import axios from 'axios'
import {env} from '../util/env'
import {DashboardData, ProcessStatus} from '../constants'

export const getDashboard = async (filter: ProcessStatus = ProcessStatus.All) => {
  return (await axios.get<DashboardData>(`${env.pollyBaseUrl}/dash?filter=${filter}`)).data
}
