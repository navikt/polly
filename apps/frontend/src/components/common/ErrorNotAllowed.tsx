import { Alert, BodyLong } from '@navikt/ds-react'

const ErrorNotAllowed = () => (
  <div className="mt-8">
    <Alert variant="warning">
      <BodyLong>Du har ikke tilgang til denne siden.</BodyLong>
    </Alert>
  </div>
)

export default ErrorNotAllowed
