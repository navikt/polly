import { Button, Modal } from '@navikt/ds-react'
import { FunctionComponent } from 'react'

interface IProps {
  isOpen: boolean
  onClose: () => void
  submitDeleteAllPolicies: () => void
}

const DeleteAllPolicyModal: FunctionComponent<IProps> = ({
  isOpen,
  onClose,
  submitDeleteAllPolicies,
}) => (
  <div>
    <Modal open={isOpen} header={{ heading: 'Bekreft sletting' }} onClose={onClose}>
      <Modal.Body>
        Er du sikkert på at du vil slette alle opplysningstyper koblet til behandlingen?
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={submitDeleteAllPolicies}>Slett</Button>
        <Button variant='secondary' onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
)

export default DeleteAllPolicyModal
