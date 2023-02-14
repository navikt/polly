import { Value } from 'baseui/select'
import { intl } from '../../../util'

export const customizeNationalLawPlaceholder = (gdpr: Value) => {
  if (!gdpr[0]) return
  switch (gdpr[0].id) {
    case 'ART61F':
      return intl.descriptionWriteLegalBasesF
      break
    case 'ART61C':
      return intl.descriptionWriteLegalBasesCE
      break
    case 'ART61E':
      return intl.descriptionWriteLegalBasesCE
      break
  }
}
