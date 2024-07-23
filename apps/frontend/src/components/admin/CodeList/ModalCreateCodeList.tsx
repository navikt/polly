import * as React from 'react'
import {ErrorMessage, Field, FieldProps, Form, Formik} from 'formik'
import { CodeListFormValues } from '../../../constants'
import { codeListSchema } from '../../common/schema'
import { BodyShort, Button, Modal, Textarea, TextField} from "@navikt/ds-react";

type ModalCreateProps = {
  title: string
  list: string
  isOpen: boolean
  errorOnCreate: any | undefined
  submit: (code: CodeListFormValues) => Promise<void>
  onClose: () => void
}

const CreateCodeListModal = ({ isOpen, title, list, errorOnCreate, onClose, submit }: ModalCreateProps) => {

  return (
    <Modal className="px-8" width="medium" open={isOpen} header={{heading:title, closeButton:false}}  onClose={()=>onClose()}>
      <div>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values) => {
            submit(values)
            onClose()
          }}
          initialValues={{
            list: list,
            code: '',
            shortName: '',
            description: '',
          }}
          validationSchema={codeListSchema()}
>
          {({errors, submitForm}) => (
            <Form>
              <Modal.Body>
                <Field
                  name="code"
                  render={({field}: FieldProps)=> (
                    <TextField
                      className="w-full"
                      {...field}
                      label="Kode"
                      error={errors.code && <ErrorMessage name="code"/>}
                      />
                  )}
                />
                  <Field
                    name="shortName"
                    render={({field}: FieldProps)=> (
                      <TextField
                        className="w-full mt-4"
                        {...field}
                        label="Navn"
                        error={errors.shortName && <ErrorMessage name="shortName" />}
                        />
                    )}
                    />
                  <Field
                    name="description"
                    render={({field}: FieldProps)=> (
                      <Textarea
                        className="w-full mt-4"
                        {...field}
                        label="Beskrivelse"
                        minRows={6}
                        error={errors.description && <ErrorMessage name="description" />}
                      />
                    )}
                  />

              </Modal.Body>
              <Modal.Footer>
                {errorOnCreate && <BodyShort>{errorOnCreate}</BodyShort>}
                <div className="flex justify-end mt-6 gap-2">
                  <Button variant="secondary" type="button" onClick={() =>onClose()}>
                    Avbryt
                  </Button>
                  <Button variant="primary" type="button" onClick={submitForm}>Lagre</Button>
                </div>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default CreateCodeListModal
