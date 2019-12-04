import * as React from "react";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "baseui/modal";
import {intl} from "../../util";
import {Paragraph2} from "baseui/typography";
import {Button} from "baseui/button";
import {Block} from "baseui/block";

type ModalDeleteProps = {
    title: string,
    list: string,
    code: string,
    isOpen: boolean,
    errorOnDelete: any | undefined,
    submit: Function,
    onClose: Function,
};

const DeleteCodeListModal =({title, list, code, isOpen, errorOnDelete, submit, onClose}:ModalDeleteProps) => {
    return(
        <Modal
            onClose={() => onClose()}
            isOpen={isOpen}
            autoFocus
            animate
            size="default"
        >
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <Paragraph2> Bekreft sletting av code "{code}" fra "{list}".</Paragraph2>
            </ModalBody>

            <ModalFooter>
                <Block display="flex" justifyContent="flex-end">
                    <Block marginRight="auto">{errorOnDelete && <p>{errorOnDelete}</p>}</Block>
                    <Button
                        kind="secondary"
                        onClick={() => onClose()}
                        overrides={{ BaseButton: { style: { marginRight: '1rem' } } }}
                    >
                        {intl.abort}
                    </Button>
                    <Button onClick={
                        ()=>submit({list:list,code:code})
                    }>
                        {intl.delete}
                    </Button>
                </Block>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteCodeListModal;