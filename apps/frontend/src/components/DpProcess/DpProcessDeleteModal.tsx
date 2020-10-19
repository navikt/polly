import {Modal, ModalBody, ModalFooter, ModalHeader} from "baseui/modal";
import * as React from "react";
import {Block} from "baseui/block";
import {Button} from "baseui/button";
import {intl} from "../../util";
import {Paragraph2} from "baseui/typography";

export const DpProcessDeleteModal = (props: {errorOnDeletion:string, isOpen: boolean, onClose: () => void, onSubmit: Function, title: String }) => {
  return (
    <>
      <Modal
        autoFocus
        animate
        unstable_ModalBackdropScroll={true}
        size="default"
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <ModalHeader>{props.title}</ModalHeader>
        <ModalBody>
          <Paragraph2>
            {intl.confirmDeleteProcessText}
          </Paragraph2>
        </ModalBody>
        <ModalFooter>
          <Block display="flex" justifyContent="flex-end">
            <Block alignSelf='flex-end'>
              {props.errorOnDeletion && <p>{props.errorOnDeletion}</p>}
            </Block>
            <Button
              kind="secondary"
              onClick={() => props.onClose()}
              overrides={{BaseButton: {style: {marginRight: '1rem'}}}}
            >
              {intl.abort}
            </Button>
            <Button
              onClick={() => props.onSubmit()}
            >
              {intl.delete}
            </Button>
          </Block>
        </ModalFooter>
      </Modal>
    </>
  )
}
