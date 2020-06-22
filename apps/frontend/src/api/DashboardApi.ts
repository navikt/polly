import axios from 'axios'
import { env } from '../util/env'
import { DashboardData } from '../constants'

export const getDashboard = async () => {
  return (await axios.get<DashboardData>(`${env.pollyBaseUrl}/dash`)).data
}
