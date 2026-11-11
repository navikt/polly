import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { IDatabehandler } from '../../constants'

interface IDeleteDatabehandlerProps {
  onClose: () => void
  isOpen: boolean
  databehandler: IDatabehandler
  submitDeleteDatabehandler: (dp: IDatabehandler) => Promise<boolean>
  errorDatabehandlerModal: undefined | any
  usageCount: number
}

export const DeleteDatabehandlerModal = (props: IDeleteDatabehandlerProps) => {
  const {
    databehandler,
    onClose,
    isOpen,
    submitDeleteDatabehandler,
    errorDatabehandlerModal,
    usageCount,
  } = props

  return (
    <Modal onClose={onClose} open={isOpen} header={{ heading: 'Bekreft sletting' }}>
      <Modal.Body>
        {usageCount === 0 ? (
          <BodyLong>Er du sikker på at du vil slette {databehandler.navn}?</BodyLong>
        ) : (
          <BodyLong>
            Kan ikke slette {databehandler.navn} siden den er knyttet til {usageCount}{' '}
            behandling(er)
          </BodyLong>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className='flex justify-end'>
          <div className='self-end'>
            {errorDatabehandlerModal && <p>{errorDatabehandlerModal}</p>}
          </div>
          <Button variant='secondary' onClick={onClose}>
            Avbryt
          </Button>
          <div className='inline mr-3' />
          <Button
            onClick={() => submitDeleteDatabehandler(databehandler).then(onClose)}
            disabled={usageCount > 0}
          >
            Slett
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
