import * as React from "react";
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from "baseui/modal";
import { Block, BlockProps } from "baseui/block";
import { Label2 } from "baseui/typography";
import { Field, FieldProps, Form, Formik } from "formik";
import { CodeListFormValues, ProcessFormValues } from "../../constants";
import { Input, SIZE as InputSIZE } from "baseui/input";
import { Error } from "../common/ModalSchema";
import { Textarea } from "baseui/textarea";
import { Button, KIND } from "baseui/button";
import { intl } from "../../util";
import { codeListSchema } from "../common/schema"

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

type ModalCreateProps = {
    title: string,
    list: string,
    isOpen: boolean,
    errorOnCreate: any | undefined,
    submit: (code: CodeListFormValues) => Promise<void>,
    onClose: () => void,
};

const CreateCodeListModal = ({isOpen, title, list, errorOnCreate, onClose, submit}: ModalCreateProps) => {
    return (
        <Modal
            closeable
            animate
            autoFocus
            size={SIZE.auto}
            role={ROLE.dialog}
            isOpen={isOpen}
            onClose={() => onClose()}
        >
            <Block {...modalBlockProps}>
                <Formik
                    onSubmit={(values) => {
                        console.log(values);
                        submit(values);
                        onClose();
                    }}
                    initialValues={
                        {
                            list: list,
                            code: "",
                            shortName: "",
                            description: "",
                        }
                    }
                    validationSchema={codeListSchema()}
                    render={() => (
                        <Form>
                            <ModalHeader>{title}</ModalHeader>
                            <ModalBody>
                                <Block {...rowBlockProps}>
                                    <Label2 marginRight={"1rem"} width="25%">
                                        Code:
                                    </Label2>
                                    <Field
                                        name="code"
                                        render={({field}: FieldProps<ProcessFormValues>) => (
                                            <Input
                                                {...field}
                                                type="input"
                                                size={InputSIZE.default}
                                            />
                                        )}
                                    />
                                </Block>
                                <Error fieldName="code"/>

                                <Block {...rowBlockProps}>
                                    <Label2 marginRight={"1rem"} width="25%">
                                        Short name:
                                    </Label2>
                                    <Field
                                        name="shortName"
                                        render={({field}: FieldProps<ProcessFormValues>) => (
                                            <Input
                                                {...field}
                                                type="input"
                                                size={InputSIZE.default}
                                            />
                                        )}
                                    />
                                </Block>
                                <Error fieldName="shortName"/>

                                <Block {...rowBlockProps}>
                                    <Label2 marginRight={"1rem"} width="25%">
                                        Description:
                                    </Label2>
                                    <Field
                                        name="description"
                                        render={({field}: FieldProps<ProcessFormValues>) => (
                                            <Textarea
                                                {...field}
                                                type="input"
                                            />
                                        )}
                                    />
                                </Block>
                                <Error fieldName="description"/>

                            </ModalBody>
                            <ModalFooter>
                                <Block display="flex" justifyContent="flex-end">
                                    <Block marginRight="auto">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
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

export default CreateCodeListModal;
