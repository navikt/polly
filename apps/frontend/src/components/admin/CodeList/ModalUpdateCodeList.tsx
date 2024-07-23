import { Field, FieldProps, Form, Formik } from 'formik'
import { CodeListFormValues } from '../../../constants'
import { codeListSchema } from '../../common/schema'
import {Button, Modal, Textarea, TextField} from "@navikt/ds-react";

type ModalUpdateProps = {
  title: string
  initialValues: CodeListFormValues
  isOpen: boolean
  errorOnUpdate: any | undefined
  onClose: () => void
  submit: (process: CodeListFormValues) => Promise<void>
}

const UpdateCodeListModal = ({ title, initialValues, errorOnUpdate, isOpen, onClose, submit }: ModalUpdateProps) => {
  return (
    <Modal className="px-8 w-full max-w-2xl" onClose={onClose} open={isOpen}
           header={{heading: title, closeButton: false}}>

        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values) => {
            submit(values)
            onClose()
          }}
          initialValues={{ ...initialValues }}
          validationSchema={codeListSchema()}
          >
          {(formik) => (
            <Form>
              <Modal.Body>
                  <Field
                    name="shortName">
                    {({ field }: FieldProps) => (
                      <TextField
                        className="w-full"
                        label="Navn"
                        {...field}
                        error={formik.errors.shortName}
                        />
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }: FieldProps) => (
                      <Textarea
                        className="w-full mt-4"
                        label="Beskrivelse"
                        {...field}
                        error={formik.errors.description}
                      />
                    )}
                  </Field>

              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-end">
                  <div className="mr-auto">{errorOnUpdate && <p>{errorOnUpdate}</p>}</div>
                  <Button className="mr-4" type="button" variant="secondary" onClick={() => onClose()}>
                    Avbryt
                  </Button>
                  <Button type="button" onClick={formik.submitForm}>Lagre</Button>
                </div>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
    </Modal>
  )
}

export default UpdateCodeListModal
