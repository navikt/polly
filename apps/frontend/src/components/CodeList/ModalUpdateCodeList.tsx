import * as React from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";

import {Field, FieldProps, Form, Formik,} from "formik";

import {Button, KIND} from "baseui/button";
import {Block, BlockProps} from "baseui/block";
import {Label2} from "baseui/typography";
import {Textarea} from "baseui/textarea";
import {Input, SIZE as InputSIZE} from "baseui/input";
import {ProcessFormValues} from "../../constants";
import * as yup from "yup";
import {intl} from "../../util/intl/intl";
import {Error} from "../common/ModalSchema";

const modalBlockProps: BlockProps = {
    width: '700px',
    paddingRight: '2rem',
    paddingLeft: '2rem'
};

const rowBlockProps: BlockProps = {
    display: 'flex',
    width: '100%',
    marginTop: '1rem',
    alignItems: 'center',
};

type ModalUpdateProps = {
    title: string;
    list: string,
    code: string,
    shortName: string,
    description: string,
    isOpen: boolean;
    onClose: Function;
    submit:Function;
};

const codeListSchema = () => yup.object({
    // code: yup.string().required(intl.required),
    shortName: yup.string().required(intl.required),
    description: yup.string().required(intl.required),

});

const UpdateCodeListModal = ({title, list, code, shortName, description, isOpen, onClose, submit}: ModalUpdateProps) => {
    return (
        <Modal
            onClose={() => onClose()}
            closeable
            isOpen={isOpen}
            animate
            autoFocus
            size={SIZE.auto}
            role={ROLE.dialog}
        >
            <Block {...modalBlockProps}>
                <Formik
                    onSubmit={(values) => {
                        submit(values);
                        onClose();
                    }}
                    initialValues={
                        {
                            list: list,
                            code: code,
                            shortName: shortName,
                            description: description,
                        }
                    }
                    validationSchema={codeListSchema()}
                    render={() => (
                        <Form>
                            <ModalHeader>{title}</ModalHeader>
                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    <Label2 marginRight={"1rem"} width="25%">
                                        Short name:
                                    </Label2>
                                    <Field
                                        name="shortName"
                                        render={({ field }: FieldProps<ProcessFormValues>) => (
                                            <Input
                                                {...field}
                                                type="input"
                                                size={InputSIZE.default}
                                            />
                                        )}
                                    />
                                </Block>
                                <Error fieldName="shortName" />
                                <Block {...rowBlockProps}>
                                    <Label2 marginRight={"1rem"} width="25%">
                                        Description:
                                    </Label2>
                                    <Field
                                        name="description"
                                        render={({ field }: FieldProps<ProcessFormValues>) => (
                                            <Textarea
                                                {...field}
                                                type="input"
                                            />
                                        )}
                                    />
                                </Block>
                                <Error fieldName="description" />
                            </ModalBody>
                            <ModalFooter>
                                <Block>
                                    <Button
                                        type="button"
                                        kind={KIND.secondary}
                                        onClick={() => onClose()}
                                    >
                                        {intl.abort}
                                    </Button>
                                    <ModalButton type="submit">
                                        {intl.save}
                                    </ModalButton>
                                </Block>
                            </ModalFooter>
                        </Form>
                    )}
                />
            </Block>
        </Modal>
    );
};

export default UpdateCodeListModal;