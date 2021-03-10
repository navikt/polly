import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {Paragraph2} from 'baseui/typography'
import {Block} from 'baseui/block'
import * as React from 'react'
import {DataProcessor} from "../../constants";
import {intl, theme} from "../../util";
import Button from "../common/Button";


interface DeleteProcessProps {
  onClose: () => void
  isOpen: boolean
  dataProcessor: DataProcessor
  submitDeleteDataProcessor: (dp: DataProcessor) => Promise<boolean>
  errorDataProcessorModal: undefined | any
}

export const DeleteDataProcessorModal = (props: DeleteProcessProps) => {
  const {dataProcessor, onClose, isOpen, submitDeleteDataProcessor, errorDataProcessorModal} = props

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
        <Paragraph2>{intl.deleteDataProcessorText}</Paragraph2>
        {<Paragraph2>{intl.confirmDeleteDataProcessorText} {dataProcessor.name}</Paragraph2>}
      </ModalBody>

      <ModalFooter>
        <Block display='flex' justifyContent='flex-end'>
          <Block alignSelf='flex-end'>{errorDataProcessorModal &&
          <p>{errorDataProcessorModal}</p>}</Block>
          <Button
            kind='secondary'
            onClick={onClose}
          >
            {intl.abort}
          </Button>
          <Block display='inline' marginRight={theme.sizing.scale500}/>
          <Button onClick={() => submitDeleteDataProcessor(dataProcessor).then(onClose)}>
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  )
}
