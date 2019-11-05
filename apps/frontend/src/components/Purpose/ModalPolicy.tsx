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

const ModalPolicy = (props: any) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Modal
            onClose={() => props.setIsOpen(false)}
            closeable
            isOpen={props.isOpen}
            animate
            size={SIZE.default}
            role={ROLE.dialog}
        >
            <ModalHeader>Hello world</ModalHeader>
            <ModalBody>
                Proin ut dui sed metus pharetra hend rerit vel non
                mi. Nulla ornare faucibus ex, non facilisis nisl.
                Maecenas aliquet mauris ut tempus.
          </ModalBody>
            <ModalFooter>
                <ModalButton>Cancel</ModalButton>
                <ModalButton>Okay</ModalButton>
            </ModalFooter>
        </Modal>
    );
}

export default ModalPolicy