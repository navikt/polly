import axios from 'axios'
import { env } from '../util/env'


export const writeLog = (level: 'info' | 'warn' | 'error', context: string, content: string) => {
  axios.post(`${env.pollyBaseUrl}/frontendlog`, {level, context, content})
  .catch(e => console.log('error writing log', e))
}
