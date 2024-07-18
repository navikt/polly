import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Block } from 'baseui/block'
import * as React from 'react'
import { Processor } from '../../constants'
import { theme } from '../../util'
import Button from '../common/Button'

interface DeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  processor: Processor
  submitDeleteProcessor: (dp: Processor) => Promise<boolean>
  errorProcessorModal: undefined | any
  usageCount: number
}

export const DeleteProcessorModal = (props: DeleteProcessProps) => {
  const { processor, onClose, isOpen, submitDeleteProcessor, errorProcessorModal, usageCount } = props

  return (
    <Modal onClose={onClose} isOpen={isOpen} animate size="default">
      <ModalHeader>Bekreft sletting</ModalHeader>
      <ModalBody>
        {usageCount === 0 ? (
          <>
            <ParagraphMedium>Er du sikker på at du vil slette {processor.name}?</ParagraphMedium>
          </>
        ) : (
          <>
            <ParagraphMedium>Kan ikke slette {processor.name} siden den er knyttet til {usageCount} behandling(er)</ParagraphMedium>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end">
          <div className="self-end">{errorProcessorModal && <p>{errorProcessorModal}</p>}</div>
          <Button kind="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <div className="inline mr-3"/>
          <Button onClick={() => submitDeleteProcessor(processor).then(onClose)} disabled={usageCount > 0}>
            Slett
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
