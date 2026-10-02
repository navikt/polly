import { AxiosError } from 'axios'

export const CONFLICT_MESSAGE =
  'Dataene er endret av en annen bruker etter at du åpnet skjemaet. Last inn siden på nytt og gjør endringene dine om igjen, ellers overskriver du andres endringer.'

/**
 * Optimistisk låsing: backend svarer med HTTP 409 CONFLICT når `version` i requesten
 * ikke lenger stemmer med versjonen i databasen.
 */
export const isConflictError = (error: unknown): boolean => {
  const axiosError = error as AxiosError | undefined
  return axiosError?.response?.status === 409
}

/**
 * Returnerer en brukervennlig melding. Ved 409 forklares det at data er endret av andre,
 * slik at brukeren kan laste på nytt i stedet for å overskrive i stillhet.
 */
export const getConflictAwareErrorMessage = (error: unknown, fallback?: string): string => {
  if (isConflictError(error)) {
    return CONFLICT_MESSAGE
  }
  const axiosError = error as AxiosError<{ message?: string }> | undefined
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    fallback ||
    'Noe gikk galt under lagring'
  )
}
