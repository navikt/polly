import axios from 'axios'
import { env } from '../util/env'


export const writeLog = (context: string, message: string) => {
  axios.post(`${env.pollyBaseUrl}/frontendlog`, {context, message})
  .catch(e => console.log('error writing log', e))
}
