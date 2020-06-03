import axios from "axios";
import { env } from "../util/env";
import { PageResponse, DashboardData } from "../constants";

export const getDashboard = async () => {
  return (await axios.get<DashboardData>(`${env.pollyBaseUrl}/dash`)).data;
};
