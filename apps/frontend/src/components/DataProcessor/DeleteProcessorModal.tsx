import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {Paragraph2} from 'baseui/typography'
import {Block} from 'baseui/block'
import * as React from 'react'
import {Processor} from "../../constants";
import {intl, theme} from "../../util";
import Button from "../common/Button";


interface DeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  processor: Processor
  submitDeleteProcessor: (dp: Processor) => Promise<boolean>
  errorProcessorModal: undefined | any
}

export const DeleteProcessorModal = (props: DeleteProcessProps) => {
  const {processor, onClose, isOpen, submitDeleteProcessor, errorProcessorModal} = props

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
        <Paragraph2>{intl.deleteProcessorText}</Paragraph2>
        {<Paragraph2>{intl.confirmDeleteProcessorText} {processor.name}</Paragraph2>}
      </ModalBody>

      <ModalFooter>
        <Block display='flex' justifyContent='flex-end'>
          <Block alignSelf='flex-end'>{errorProcessorModal &&
          <p>{errorProcessorModal}</p>}</Block>
          <Button
            kind='secondary'
            onClick={onClose}
          >
            {intl.abort}
          </Button>
          <Block display='inline' marginRight={theme.sizing.scale500}/>
          <Button onClick={() => submitDeleteProcessor(processor).then(onClose)}>
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}
