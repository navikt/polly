import amplitude from 'amplitude-js'
import { env } from '../util/env'

const AmplitudeConfig = {
  apiEndpoint: env.amplitudeEndpoint,
  saveEvents: true,
  includeUtm: true,
  includeReferrer: true,
  trackingOptions: {
    city: false,
    ip_address: false
  }
}

export const instance = amplitude.getInstance()
instance.init(env.amplitudeApiKey!, undefined, AmplitudeConfig)
export const ampli = instance
