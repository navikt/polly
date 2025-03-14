import { BodyShort, Button, Modal, TextField, Textarea } from '@navikt/ds-react'
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik'
import { ICodeListFormValues } from '../../../constants'
import { codeListSchema } from '../../common/schemaValidation'

type TModalCreateProps = {
  title: string
  list: string
  isOpen: boolean
  errorOnCreate: any | undefined
  submit: (code: ICodeListFormValues) => Promise<void>
  onClose: () => void
}

interface ISubmitValues {
  list: string
  code: string
  shortName: string
  description: string
}

const CreateCodeListModal = ({
  isOpen,
  title,
  list,
  errorOnCreate,
  onClose,
  submit,
}: TModalCreateProps) => (
  <Modal
    className="px-8"
    width="medium"
    open={isOpen}
    header={{ heading: title, closeButton: false }}
    onClose={() => onClose()}
  >
    <div>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values: ISubmitValues) => {
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
        {({ errors, submitForm }) => (
          <Form>
            <Modal.Body>
              <Field name="code">
                {({ field }: FieldProps) => (
                  <TextField
                    className="w-full"
                    {...field}
                    label="Kode"
                    error={errors.code && <ErrorMessage name="code" />}
                  />
                )}
              </Field>
              <Field name="shortName">
                {({ field }: FieldProps) => (
                  <TextField
                    className="w-full mt-4"
                    {...field}
                    label="Navn"
                    error={errors.shortName && <ErrorMessage name="shortName" />}
                  />
                )}
              </Field>
              <Field name="description">
                {({ field }: FieldProps) => (
                  <Textarea
                    className="w-full mt-4"
                    {...field}
                    label="Beskrivelse"
                    minRows={6}
                    error={errors.description && <ErrorMessage name="description" />}
                  />
                )}
              </Field>
            </Modal.Body>
            <Modal.Footer>
              {errorOnCreate && <BodyShort>{errorOnCreate}</BodyShort>}
              <div className="flex justify-end mt-6 gap-2">
                <Button variant="secondary" type="button" onClick={() => onClose()}>
                  Avbryt
                </Button>
                <Button variant="primary" type="button" onClick={submitForm}>
                  Lagre
                </Button>
              </div>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </div>
  </Modal>
)

export default CreateCodeListModal
