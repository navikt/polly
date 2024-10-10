import { Button, Modal } from '@navikt/ds-react'

type TModalDeleteProps = {
  title: string
  isOpen: boolean
  documentName: string
  documentUsageCount?: number
  submit: () => void
  onClose: () => void
}

const DeleteDocumentModal = ({
  title,
  documentName = '',
  isOpen,
  onClose,
  submit,
  documentUsageCount,
}: TModalDeleteProps) => (
  <Modal onClose={onClose} open={isOpen} header={{ heading: title }}>
    <Modal.Body>
      {!documentUsageCount ? (
        <div>{`Bekreft sletting av dokument"${documentName}"`}</div>
      ) : (
        <div>
          {`Kan ikke slette behandlingen ${documentName.toString()}
          den inneholder fortsatt ${documentUsageCount.toString()} opplysningstype(r)`}
        </div>
      )}
    </Modal.Body>

    <Modal.Footer>
      <div className="flex justify-end">
        <Button className="mr-4" variant="secondary" onClick={() => onClose()}>
          Avbryt
        </Button>
        <Button
          onClick={() => submit()}
          disabled={!(documentUsageCount === 0 || documentUsageCount === undefined)}
        >
          Slett
        </Button>
      </div>
    </Modal.Footer>
  </Modal>
)

export default DeleteDocumentModal
