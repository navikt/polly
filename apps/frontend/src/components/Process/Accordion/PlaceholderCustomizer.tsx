export const customizeNationalLawPlaceholder = (gdpr: string): string => {
  switch (gdpr) {
    case 'ART61F':
      return 'Spesifiser interessen'
    case 'ART61C':
      return 'Legg inn paragraf (§) eller kapittel'
    case 'ART61E':
      return 'Legg inn paragraf (§) eller kapittel'
    default:
      return ''
  }
}
