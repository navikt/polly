import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import * as React from 'react'
import { Block } from 'baseui/block'
import { Button } from 'baseui/button'
import { ParagraphMedium } from 'baseui/typography'

export const DpProcessDeleteModal = (props: { errorOnDeletion: string; isOpen: boolean; onClose: () => void; onSubmit: Function; title: String }) => {
  return (
    <>
      <Modal autoFocus animate size="default" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalBody>
          <ParagraphMedium>Bekreft sletting av behandlingen</ParagraphMedium>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end">
            <div className="self-end">{props.errorOnDeletion && <p>{props.errorOnDeletion}</p>}</div>
            <Button kind="secondary" onClick={() => props.onClose()} overrides={{ BaseButton: { style: { marginRight: '1rem' } } }}>
              Avbryt
            </Button>
            <Button onClick={() => props.onSubmit()}>Slett</Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
