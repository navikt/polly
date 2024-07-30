import { Button } from 'baseui/button'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'

interface IDpProcessDeleteModal {
  errorOnDeletion: string
  isOpen: boolean
  onClose: () => void
  onSubmit: Function
  title: String
}

export const DpProcessDeleteModal = (props: IDpProcessDeleteModal) => {
  const { errorOnDeletion, isOpen, onClose, onSubmit, title } = props

  return (
    <>
      <Modal autoFocus animate size="default" isOpen={isOpen} onClose={onClose}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <ParagraphMedium>Bekreft sletting av behandlingen</ParagraphMedium>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end">
            <div className="self-end">{errorOnDeletion && <p>{errorOnDeletion}</p>}</div>
            <Button kind="secondary" onClick={() => onClose()} overrides={{ BaseButton: { style: { marginRight: '1rem' } } }}>
              Avbryt
            </Button>
            <Button onClick={() => onSubmit()}>Slett</Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
