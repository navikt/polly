import {Modal, ModalBody, ModalFooter, ModalHeader} from "baseui/modal";
import {Paragraph2} from "baseui/typography";
import {Block} from "baseui/block";
import {Button} from "baseui/button";
import {intl} from "../../../util";
import * as React from "react";

type ModalDeleteProps = {
  title: string,
  isOpen: boolean,
  disable: boolean
  documentName: String,
  documentUsageCount?: number,
  submit: () => void,
  onClose: () => void,
};

const DeleteDocumentModal = ({title, documentName = "", isOpen, onClose, submit, disable, documentUsageCount}: ModalDeleteProps) => {
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      autoFocus
      animate
      size="default"
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {documentUsageCount === 0 || documentUsageCount === undefined ? (
            <Paragraph2> {intl.confirmDeleteDocumentText} "{documentName}"</Paragraph2>
          ) :
          (
            <Paragraph2>{intl.formatString(intl.cannotDeleteProcess, documentName.toString(), documentUsageCount.toString())}</Paragraph2>
          )}
      </ModalBody>

      <ModalFooter>
        <Block display="flex" justifyContent="flex-end">
          <Button
            kind="secondary"
            onClick={() => onClose()}
            overrides={{BaseButton: {style: {marginRight: '1rem'}}}}
          >
            {intl.abort}
          </Button>
          <Button
            onClick={() => submit()}
            disabled={disable}
          >
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteDocumentModal;
