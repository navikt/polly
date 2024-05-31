import { Value } from 'baseui/select'

export const customizeNationalLawPlaceholder = (gdpr: Value) => {
  if (!gdpr[0]) return
  switch (gdpr[0].id) {
    case 'ART61F':
      return 'Spesifiser interessen'
      break
    case 'ART61C':
      return 'Legg inn paragraf (§) eller kapittel'
      break
    case 'ART61E':
      return 'Legg inn paragraf (§) eller kapittel'
      break
  }
}
