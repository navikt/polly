import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {intl, theme} from '../../../util'
import {Paragraph2} from 'baseui/typography'
import {Block} from 'baseui/block'
import Button from '../../common/Button'
import * as React from 'react'
import {Disclosure, Process} from '../../../constants'


interface DeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  process: Process
  submitDeleteProcess: (process: Process) => Promise<boolean>
  errorProcessModal: string
  disclosures: Disclosure[]
}

export const DeleteProcessModal = (props: DeleteProcessProps) => {
  const {process, onClose, isOpen, submitDeleteProcess, errorProcessModal,disclosures} = props

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      animate
      unstable_ModalBackdropScroll={true}
      size='default'
    >
      <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
      <ModalBody>
        <Paragraph2>{intl.deleteProcessText}</Paragraph2>
        {!process.policies.length && <Paragraph2>{intl.confirmDeleteProcessText} {process.name}</Paragraph2>}
        {!!process.policies.length &&
        <Paragraph2>{intl.formatString(intl.cannotDeleteProcess, process.name, '' + process.policies.length)}</Paragraph2>}

        {!!disclosures.length &&
        <Paragraph2>{intl.deleteProcessDisclosureError}</Paragraph2>}
      </ModalBody>

      <ModalFooter>
        <Block display='flex' justifyContent='flex-end'>
          <Block alignSelf='flex-end'>{errorProcessModal &&
          <p>{errorProcessModal}</p>}</Block>
          <Button
            kind='secondary'
            onClick={onClose}
          >
            {intl.abort}
          </Button>
          <Block display='inline' marginRight={theme.sizing.scale500}/>
          <Button onClick={() => {
            submitDeleteProcess(process).then(onClose)
          }}
                  disabled={!!process.policies.length || !!disclosures.length}>
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}
