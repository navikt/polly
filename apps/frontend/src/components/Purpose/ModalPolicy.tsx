import * as React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
} from "baseui/modal";
import { BlockProps, Block } from "baseui/block";

const modalBlockProps: BlockProps = {
    width: '800px'
}

const ModalPolicy = (props: any) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Modal
            {...props}
            closeable
            animate
            size={SIZE.auto}
            role={ROLE.dialog}
        >
            <Block {...modalBlockProps}>
                <ModalHeader>Legg til ny policy</ModalHeader>

                <ModalBody>
                    Proin ut dui sed metus pharetra hend rerit vel non
                    mi. Nulla ornare faucibus ex, non facilisis nisl.
                    Maecenas aliquet mauris ut tempus.
                </ModalBody>

                <ModalFooter>
                    <ModalButton>Cancel</ModalButton>
                    <ModalButton>Okay</ModalButton>
                </ModalFooter>
            </Block>

        </Modal>

    );
}

export default ModalPolicy