import moment from 'moment'
import { currentLang } from './intl/intl'

export const lastModifiedDate = (lastModifiedDateString: string) => {
  return moment(lastModifiedDateString).locale(currentLang().langCode).format('LL')
}
