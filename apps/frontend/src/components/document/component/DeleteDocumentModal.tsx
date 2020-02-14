import {Modal, ModalBody, ModalFooter, ModalHeader} from "baseui/modal";
import {Paragraph2} from "baseui/typography";
import {Block} from "baseui/block";
import {Button} from "baseui/button";
import {intl} from "../../../util";
import * as React from "react";

type ModalDeleteProps = {
  title: string,
  isOpen: boolean,
  documentName: String,
  submit: () => void,
  onClose: () => void,
};

const DeleteDocumentModal = ({title, documentName, isOpen, onClose, submit}: ModalDeleteProps) => {
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
        <Paragraph2> {intl.confirmDeleteDocumentText} "{documentName}" </Paragraph2>
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
          <Button onClick={
            () => submit()
          }>
            {intl.delete}
          </Button>
        </Block>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteDocumentModal;
