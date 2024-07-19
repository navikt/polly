import * as React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Button } from 'baseui/button'
import { Block } from 'baseui/block'
import { CodeListFormValues } from '../../constants'

type ModalDeleteProps = {
  title: string
  initialValues: CodeListFormValues
  isOpen: boolean
  errorOnDelete: any | undefined
  submit: (code: CodeListFormValues) => void
  onClose: () => void
}

const DeleteCodeListModal = ({ title, initialValues, isOpen, errorOnDelete, submit, onClose }: ModalDeleteProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} autoFocus animate size="default">
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <ParagraphMedium>
          {' '}
          Bekreft sletting av code "{initialValues.code}" fra "{initialValues.list}".
        </ParagraphMedium>
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end">
          <div className="mr-auto">{errorOnDelete && <p>{errorOnDelete}</p>}</div>
          <Button kind="secondary" onClick={() => onClose()} overrides={{ BaseButton: { style: { marginRight: '1rem' } } }}>
            Avbryt
          </Button>
          <Button onClick={() => submit({ list: initialValues.list, code: initialValues.code })}>Slett</Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteCodeListModal
