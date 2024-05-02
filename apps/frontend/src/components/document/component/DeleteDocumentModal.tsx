import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'
import * as React from 'react'

type ModalDeleteProps = {
  title: string
  isOpen: boolean
  documentName: String
  documentUsageCount?: number
  submit: () => void
  onClose: () => void
}

const DeleteDocumentModal = ({ title, documentName = '', isOpen, onClose, submit, documentUsageCount }: ModalDeleteProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} autoFocus animate size="default">
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {!!!documentUsageCount ? (
          <ParagraphMedium>
            {' '}
            Bekreft sletting av dokument "{documentName}"
          </ParagraphMedium>
        ) : (
         <ParagraphMedium>{`Kan ikke slette behandlingen ${documentName.toString()}
          den inneholder fortsatt ${documentUsageCount.toString()} opplysningstype(r)`}</ParagraphMedium>
        )}
      </ModalBody>

      <ModalFooter>
        <Block display="flex" justifyContent="flex-end">
          <Button kind="secondary" onClick={() => onClose()} overrides={{ BaseButton: { style: { marginRight: '1rem' } } }}>
            Avbryt
          </Button>
          <Button onClick={() => submit()} disabled={!(documentUsageCount === 0 || documentUsageCount === undefined)}>
            Slett
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteDocumentModal
