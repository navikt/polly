import { intl, theme } from '../../../util'
import * as React from 'react'
import { Disclosure, Process } from '../../../constants'
import {BodyShort, Heading, List} from '@navikt/ds-react'
import {Modal, Button} from '@navikt/ds-react'

interface DeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  process: Process
  submitDeleteProcess: (process: Process) => Promise<boolean>
  errorProcessModal: string
  disclosures: Disclosure[]
}

export const DeleteProcessModal = (props: DeleteProcessProps) => {
  const { process, onClose, isOpen, submitDeleteProcess, errorProcessModal, disclosures } = props

  return (
    <Modal header={{heading: intl.confirmDeleteHeader}} onClose={onClose} open={isOpen}>
      <Modal.Body>
        <BodyShort spacing>
          {intl.deleteProcessText}
        </BodyShort>

        {!process.policies.length && (
          <BodyShort spacing>
            {intl.confirmDeleteProcessText} {process.name}
          </BodyShort>
        )}
        {(!!process.policies.length || !!disclosures.length) && (
          <List as="ul" title={intl.deleteRelationText}>
            {!!process.policies.length && <List.Item>{intl.formatString(intl.cannotDeleteProcess, process.name, '' + process.policies.length)}</List.Item>}
            {!!disclosures.length && <List.Item>{intl.deleteProcessDisclosureError}</List.Item>}
          </List>
        )}
      </Modal.Body>

      <Modal.Footer>
          <div className="self-end">{errorProcessModal && <BodyShort>{errorProcessModal}</BodyShort>}</div>
          <Button
            onClick={() => {
              submitDeleteProcess(process).then(onClose)
            }}
            disabled={!!process.policies.length || !!disclosures.length}
          >
            {intl.delete}
          </Button>
        <Button variant="secondary" onClick={onClose}>
          {intl.abort}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
