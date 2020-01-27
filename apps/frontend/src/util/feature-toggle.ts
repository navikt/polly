import { env } from "./env"

export const features = {
  enableThirdParty: !env.disableThirdParty
}
