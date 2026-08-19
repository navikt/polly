export interface IStrings {
  // groups
  READ: string
  WRITE: string
  SUPER: string
  ADMIN: string

  CREATE: string
  DELETE: string
  UPDATE: string

  // Tables
  INFORMATION_TYPE: string
  POLICY: string
  PROCESS: string
  DISCLOSURE: string
  DOCUMENT: string
  CODELIST: string

  INFO: string
  WARNING: string
  ERROR: string

  // Alert events
  MISSING_LEGAL_BASIS: string
  EXCESS_INFO: string
  MISSING_ARTICLE_6: string
  MISSING_ARTICLE_9: string
  USES_ALL_INFO_TYPE: string
}

export const tekster: IStrings = {
  READ: 'Les',
  WRITE: 'Skriv',
  SUPER: 'Super',
  ADMIN: 'Admin',

  CREATE: 'Opprett',
  UPDATE: 'Oppdater',
  DELETE: 'Slett',

  INFORMATION_TYPE: 'Opplysningstype',
  POLICY: 'Opplysningstype i behandling',
  PROCESS: 'Behandling',
  DISCLOSURE: 'Utlevering',
  DOCUMENT: 'Dokument',
  CODELIST: 'Kodeverk',

  INFO: 'Info',
  WARNING: 'Advarsel',
  ERROR: 'Feil',

  MISSING_LEGAL_BASIS: 'Behandlingsgrunnlag er ikke avklart',
  EXCESS_INFO: 'Overskuddsinformasjon',
  MISSING_ARTICLE_6: 'Behandlingsgrunnlag for artikkel 6 mangler',
  MISSING_ARTICLE_9: 'Behandlingsgrunnlag for artikkel 9 mangler',
  USES_ALL_INFO_TYPE: 'Bruker alle opplysningstyper',
}
