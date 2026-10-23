import { Link, LocalAlert } from '@navikt/ds-react'
import { FunctionComponent, RefObject, SetStateAction } from 'react'

type TProps = {
  ref: RefObject<HTMLDivElement | null>
  movedBehandlingLink: string
  setMovedBehandlingLink: (value: SetStateAction<string>) => void
  movedBehandlingNavn: string
  setMovedBehandlingNavn: (value: SetStateAction<string>) => void
}

const SavedAlertMovedBehandling: FunctionComponent<TProps> = ({
  ref,
  movedBehandlingLink,
  setMovedBehandlingLink,
  movedBehandlingNavn,
  setMovedBehandlingNavn,
}) => {
  return (
    <LocalAlert
      ref={ref}
      tabIndex={-1}
      status='success'
      className='max-w-[100ch] mb-5 scroll-mt-(--polly-process-header-height)'
    >
      <LocalAlert.Header>
        <LocalAlert.Title>
          Endringene dine er lagret, og behandlingen er flyttet til riktig sted.
        </LocalAlert.Title>
        <LocalAlert.CloseButton
          onClick={() => {
            setMovedBehandlingLink('')
            setMovedBehandlingNavn('')
          }}
        />
      </LocalAlert.Header>
      <LocalAlert.Content>
        <Link href={movedBehandlingLink} target='_blank' rel='noopener noreferrer'>
          Gå til {movedBehandlingNavn} (åpner i en ny fane)
        </Link>
      </LocalAlert.Content>
    </LocalAlert>
  )
}
export default SavedAlertMovedBehandling
