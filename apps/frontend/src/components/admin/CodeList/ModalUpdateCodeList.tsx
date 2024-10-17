import { Button, Modal, TextField, Textarea } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { ICodeListFormValues } from '../../../constants'
import { codeListSchema } from '../../common/schema'

type TModalUpdateProps = {
  title: string
  initialValues: ICodeListFormValues
  isOpen: boolean
  errorOnUpdate: any | undefined
  onClose: () => void
  submit: (process: ICodeListFormValues) => Promise<void>
}

interface ISubmitValues {
  list: string
  code: string
  shortName?: string
  description?: string
}

const UpdateCodeListModal = ({
  title,
  initialValues,
  errorOnUpdate,
  isOpen,
  onClose,
  submit,
}: TModalUpdateProps) => (
  <Modal
    className="px-8 w-full max-w-2xl"
    onClose={onClose}
    open={isOpen}
    header={{ heading: title, closeButton: false }}
  >
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values: ISubmitValues) => {
        submit(values)
        onClose()
      }}
      initialValues={{ ...initialValues }}
      validationSchema={codeListSchema()}
    >
      {(formik) => (
        <Form>
          <Modal.Body>
            <Field name="shortName">
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
              <Button type="button" onClick={formik.submitForm}>
                Lagre
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  </Modal>
)

export default UpdateCodeListModal
