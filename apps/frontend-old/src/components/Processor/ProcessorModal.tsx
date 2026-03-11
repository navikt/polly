import { Button, ErrorSummary, Modal, Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import { IProcessorFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { FormError } from '../common/ModalSchema'
import { dataProcessorSchema } from '../common/schemaValidation'
import FieldContractOwner from './components/FieldContractOwner'
import FieldCountries from './components/FieldCountries'
import FieldNote from './components/FieldNote'
import FieldOperationalContractManagers from './components/FieldOperationalContractManagers'
import FieldTransferGroundsOutsideEU from './components/FieldTransferGroundsOutsideEU'
import FieldTransferGroundsOutsideEUOther from './components/FieldTransferGroundsOutsideEUOther'

type TModalProcessorProps = {
  title: string
  isOpen: boolean
  initialValues: IProcessorFormValues
  errorMessage: any | undefined
  submit: (processor: IProcessorFormValues) => void
  onClose: () => void
}

const ProcessorModal = (props: TModalProcessorProps) => {
  const { title, isOpen, initialValues, errorMessage, submit, onClose } = props
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const [validateOnBlur, setValidateOnBlur] = useState(false)

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      header={{
        heading: title,
        closeButton: false,
      }}
    >
      <Formik
        onSubmit={(values: IProcessorFormValues) => {
          submit(values)
        }}
        initialValues={initialValues}
        validationSchema={dataProcessorSchema()}
        validateOnBlur={false}
        validateOnChange={validateOnBlur}
      >
        {(formikBag) => (
          <Form id="modal-processor-form">
            <Modal.Body>
              <Field name="name">
                {({ field }: FieldProps<string, IProcessorFormValues>) => (
                  <TextField
                    id="name"
                    className="w-full"
                    label="Navn på databehandler"
                    {...field}
                  />
                )}
              </Field>
              <FormError fieldName="name" akselStyling />

              <Field name="contract">
                {({ field }: FieldProps<string, IProcessorFormValues>) => (
                  <TextField
                    className="w-full mt-4"
                    label="Referanse til databehandleravtalen, gjerne lenke(URL) i Public 360 e.l."
                    {...field}
                  />
                )}
              </Field>

              <FieldContractOwner formikBag={formikBag} />
              <FieldOperationalContractManagers formikBag={formikBag} />
              <FieldNote />

              <RadioGroup
                value={formikBag.values.outsideEU}
                className=" w-full mt-4"
                legend="Overføres data til utlandet"
                description="Behandler databehandler personopplysninger utenfor EU/EØS?"
                onChange={(value) => formikBag.setFieldValue('outsideEU', value)}
              >
                <Radio value={true}>Ja</Radio>
                <Radio value={false}>Nei</Radio>
                <Radio value={undefined}>Uavklart</Radio>
              </RadioGroup>

              {formikBag.values.outsideEU && (
                <>
                  <FieldTransferGroundsOutsideEU />
                  <FormError fieldName="transferGroundsOutsideEU" akselStyling />

                  {formikBag.values.transferGroundsOutsideEU ===
                    TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                    <>
                      <FieldTransferGroundsOutsideEUOther />
                      <FormError fieldName="transferGroundsOutsideEUOther" akselStyling />
                    </>
                  )}

                  <FieldCountries formikBag={formikBag} />
                  <FormError fieldName="countries" akselStyling />
                </>
              )}

              {Object.values(formikBag.errors).some(Boolean) && (
                <ErrorSummary
                  ref={errorSummaryRef}
                  heading="Du må rette disse feilene før du kan fortsette"
                >
                  {Object.entries(formikBag.errors)
                    .filter(([, error]) => error)
                    .map(([key, error]) => (
                      <ErrorSummary.Item href={`#${key}`} key={key}>
                        {error as string}
                      </ErrorSummary.Item>
                    ))}
                </ErrorSummary>
              )}
            </Modal.Body>

            <Modal.Footer>
              <div className="flex justify-end gap-4">
                <div className="self-end">{errorMessage && <p>{errorMessage}</p>}</div>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Avbryt
                </Button>
                <Button type="submit" variant="primary" onClick={() => setValidateOnBlur(true)}>
                  Lagre
                </Button>
              </div>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default ProcessorModal
