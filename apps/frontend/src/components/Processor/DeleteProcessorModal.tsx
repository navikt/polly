import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { IProcessor } from '../../constants'

interface IDeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  processor: IProcessor
  submitDeleteProcessor: (dp: IProcessor) => Promise<boolean>
  errorProcessorModal: undefined | any
  usageCount: number
}

export const DeleteProcessorModal = (props: IDeleteProcessProps) => {
  const { processor, onClose, isOpen, submitDeleteProcessor, errorProcessorModal, usageCount } =
    props

  return (
    <Modal onClose={onClose} open={isOpen} header={{ heading: 'Bekreft sletting' }}>
      <Modal.Body>
        {usageCount === 0 ? (
          <BodyLong>Er du sikker på at du vil slette {processor.name}?</BodyLong>
        ) : (
          <BodyLong>
            Kan ikke slette {processor.name} siden den er knyttet til {usageCount} behandling(er)
          </BodyLong>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end">
          <div className="self-end">{errorProcessorModal && <p>{errorProcessorModal}</p>}</div>
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <div className="inline mr-3" />
          <Button
            onClick={() => submitDeleteProcessor(processor).then(onClose)}
            disabled={usageCount > 0}
          >
            Slett
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
