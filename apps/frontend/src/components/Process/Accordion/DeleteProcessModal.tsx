import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { intl, theme } from '../../../util'
import { ParagraphMedium } from 'baseui/typography'
import { Block } from 'baseui/block'
import Button from '../../common/Button'
import * as React from 'react'
import { Disclosure, Process } from '../../../constants'
import { List } from '@navikt/ds-react'

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
    <Modal onClose={onClose} isOpen={isOpen} animate size="default">
      <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
      <ModalBody>
        <ParagraphMedium>{intl.deleteProcessText}</ParagraphMedium>
        {!process.policies.length && (
          <ParagraphMedium>
            {intl.confirmDeleteProcessText} {process.name}
          </ParagraphMedium>
        )}
        {(!!process.policies.length || !!disclosures.length) && (
          <List as="ul" title={intl.deleteRelationText}>
            {!!process.policies.length && <List.Item>{intl.formatString(intl.cannotDeleteProcess, process.name, '' + process.policies.length)}</List.Item>}
            {!!disclosures.length && <List.Item>{intl.deleteProcessDisclosureError}</List.Item>}
          </List>
        )}
      </ModalBody>

      <ModalFooter>
        <Block display="flex" justifyContent="flex-end">
          <Block alignSelf="flex-end">{errorProcessModal && <p>{errorProcessModal}</p>}</Block>
          <Button kind="secondary" onClick={onClose}>
            {intl.abort}
          </Button>
          <Block display="inline" marginRight={theme.sizing.scale500} />
          <Button
            onClick={() => {
              submitDeleteProcess(process).then(onClose)
            }}
            disabled={!!process.policies.length || !!disclosures.length}
          >
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}
