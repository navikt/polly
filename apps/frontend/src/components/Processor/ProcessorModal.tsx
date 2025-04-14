import { Button, Modal, Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { IProcessorFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { disableEnter } from '../../util/helper-functions'
import { Error } from '../common/ModalSchema'
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
      >
        {(formikBag) => (
          <Form onKeyDown={disableEnter}>
            <Modal.Body>
              <Field name="name">
                {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
                  <TextField
                    className="w-full"
                    label="Navn på databehandler"
                    {...field}
                    error={!!form.errors.name && form.touched.name}
                  />
                )}
              </Field>

              <Error fieldName={'name'} />

              <Field name="contract">
                {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
                  <TextField
                    className="w-full mt-4"
                    label="Ref. på databehandleravtale"
                    description="Referanse til avtalen, gjerne URL til avtalen i Public 360 e.l."
                    {...field}
                    error={!!form.errors.contract && form.touched.contract}
                  />
                )}
              </Field>

              <Error fieldName={'contract'} />

              <FieldContractOwner formikBag={formikBag} />

              <FieldOperationalContractManagers formikBag={formikBag} />

              <FieldNote />

              <RadioGroup
                value={formikBag.values.outsideEU}
                className=" w-full mt-4"
                legend="Overføres data til utlandet"
                description="Behandler databehandler personopplysninger utenfor EU/EØS?"
                onChange={(value) => formikBag.setFieldValue('outsideEU', value)}
                error={formikBag.errors.outsideEU}
              >
                <Radio value={true}>Ja</Radio>
                <Radio value={false}>Nei</Radio>
                <Radio value={undefined}>Uavklart</Radio>
              </RadioGroup>

              {formikBag.values.outsideEU && (
                <>
                  <div className="mt-4">
                    <FieldTransferGroundsOutsideEU />
                  </div>
                  <Error fieldName="transferGroundsOutsideEU" />

                  {formikBag.values.transferGroundsOutsideEU ===
                    TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                    <div className="mt-4">
                      <FieldTransferGroundsOutsideEUOther />
                    </div>
                  )}
                  <Error fieldName="transferGroundsOutsideEUOther" />

                  <div className="mt-4">
                    <FieldCountries formikBag={formikBag} />
                  </div>
                  <Error fieldName="countries" />
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end gap-4">
                <div className="self-end">{errorMessage && <p>{errorMessage}</p>}</div>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Avbryt
                </Button>
                <Button type="submit" variant="primary">
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
