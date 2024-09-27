import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { IProcessor } from '../../constants'
import Button from '../common/Button'

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
    <Modal onClose={onClose} isOpen={isOpen} animate size="default">
      <ModalHeader>Bekreft sletting</ModalHeader>
      <ModalBody>
        {usageCount === 0 ? (
          <ParagraphMedium>Er du sikker på at du vil slette {processor.name}?</ParagraphMedium>
        ) : (
          <ParagraphMedium>
            Kan ikke slette {processor.name} siden den er knyttet til {usageCount} behandling(er)
          </ParagraphMedium>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end">
          <div className="self-end">{errorProcessorModal && <p>{errorProcessorModal}</p>}</div>
          <Button kind="secondary" onClick={onClose}>
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
      </ModalFooter>
    </Modal>
  )
}
