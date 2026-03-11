import axios from 'axios'
import { env } from '../util/env'

export const writeLog = (level: 'info' | 'warn' | 'error', context: string, content: string) => {
  axios
    .post(`${env.pollyBaseUrl}/frontendlog`, { level, context, content })
    .catch((error) => console.debug('error writing log', error))
}
