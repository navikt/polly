import { Button, Modal } from '@navikt/ds-react'

interface IDpProcessDeleteModal {
  errorOnDeletion: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  title: string
}

export const DpProcessDeleteModal = (props: IDpProcessDeleteModal) => {
  const { errorOnDeletion, isOpen, onClose, onSubmit, title } = props

  return (
    <>
      <Modal open={isOpen} onClose={onClose} header={{ heading: title }}>
        <Modal.Body>Bekreft sletting av behandlingen</Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end">
            <div className="self-end">{errorOnDeletion && <p>{errorOnDeletion}</p>}</div>
            <Button variant="secondary" onClick={() => onClose()}>
              Avbryt
            </Button>
            <Button onClick={() => onSubmit()}>Slett</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}
