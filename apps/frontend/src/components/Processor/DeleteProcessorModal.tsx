import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Block } from 'baseui/block'
import * as React from 'react'
import { Processor } from '../../constants'
import { intl, theme } from '../../util'
import Button from '../common/Button'

interface DeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  processor: Processor
  submitDeleteProcessor: (dp: Processor) => Promise<boolean>
  errorProcessorModal: undefined | any
  usageCount: number
}

export const DeleteProcessorModal = (props: DeleteProcessProps) => {
  const { processor, onClose, isOpen, submitDeleteProcessor, errorProcessorModal, usageCount } = props

  return (
    <Modal onClose={onClose} isOpen={isOpen} animate size="default">
      <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
      <ModalBody>
        {usageCount === 0 ? (
          <>
            <ParagraphMedium> {intl.deleteProcessorText}</ParagraphMedium>
            <ParagraphMedium>
              {intl.confirmDeleteProcessorText} {processor.name}
            </ParagraphMedium>
          </>
        ) : (
          <>
            <ParagraphMedium>{intl.formatString(intl.canNotDeleteProcessorParagraph1, processor.name)}</ParagraphMedium>
            <ParagraphMedium>{intl.formatString(intl.canNotDeleteProcessorParagraph2, usageCount)}</ParagraphMedium>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Block display="flex" justifyContent="flex-end">
          <Block alignSelf="flex-end">{errorProcessorModal && <p>{errorProcessorModal}</p>}</Block>
          <Button kind="secondary" onClick={onClose}>
            {intl.abort}
          </Button>
          <Block display="inline" marginRight={theme.sizing.scale500} />
          <Button onClick={() => submitDeleteProcessor(processor).then(onClose)} disabled={usageCount > 0}>
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}
