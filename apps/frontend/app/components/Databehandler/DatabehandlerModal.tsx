'use client'

import { Button, ErrorSummary, Modal, Radio, RadioGroup, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import { IDatabehandlerFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { FormError } from '../common/ModalSchema'
import { databehandlerSchema } from '../common/schemaValidation'
import FieldAvtaleeier from './components/FieldAvtaleeier'
import FieldFagansvarlig from './components/FieldFagansvarlig'
import FieldLandDataOverforesTil from './components/FieldLandDataOverforesTil'
import FieldMerknad from './components/FieldMerknad'
import FieldOverforingsgrunnlagUtenforEuEos from './components/FieldOverforingsgrunnlagUtenforEuEos'
import FieldOverforingsgrunnlagUtenforEuEosAnnet from './components/FieldOverforingsgrunnlagUtenforEuEosAnnet'

type TDatabehandlerModalProps = {
  title: string
  isOpen: boolean
  initialValues: IDatabehandlerFormValues
  errorMessage: any | undefined
  submit: (databehandler: IDatabehandlerFormValues) => void
  onClose: () => void
}

const DatabehandlerModal = (props: TDatabehandlerModalProps) => {
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
        onSubmit={(values: IDatabehandlerFormValues) => {
          submit(values)
        }}
        initialValues={initialValues}
        validationSchema={databehandlerSchema()}
        validateOnBlur={false}
        validateOnChange={validateOnBlur}
      >
        {(formikBag) => (
          <>
            <Modal.Body>
              <Form id='modal-databehandler-form'>
                <Field name='navn'>
                  {({ field }: FieldProps<string, IDatabehandlerFormValues>) => (
                    <TextField
                      type='text'
                      id='navn'
                      className='w-full'
                      label='Navn på databehandler'
                      {...field}
                    />
                  )}
                </Field>
                <FormError fieldName='navn' akselStyling />

                <Field name='avtalereferanse'>
                  {({ field }: FieldProps<string, IDatabehandlerFormValues>) => (
                    <TextField
                      type='url'
                      className='w-full mt-4'
                      label='Referanse til databehandleravtalen, gjerne lenke(URL) i Public 360 e.l.'
                      {...field}
                    />
                  )}
                </Field>

                <FieldAvtaleeier formikBag={formikBag} />
                <FieldFagansvarlig formikBag={formikBag} />
                <FieldMerknad />

                <RadioGroup
                  value={formikBag.values.behandlingUtenforEuEos}
                  className=' w-full mt-4'
                  legend='Overføres data til utlandet'
                  description='Behandler databehandler personopplysninger utenfor EU/EØS?'
                  onChange={(value) => formikBag.setFieldValue('behandlingUtenforEuEos', value)}
                >
                  <Radio value={true}>Ja</Radio>
                  <Radio value={false}>Nei</Radio>
                  <Radio value={undefined}>Uavklart</Radio>
                </RadioGroup>

                {formikBag.values.behandlingUtenforEuEos && (
                  <>
                    <FieldOverforingsgrunnlagUtenforEuEos />
                    <FormError fieldName='overforingsgrunnlagUtenforEuEos' akselStyling />

                    {formikBag.values.overforingsgrunnlagUtenforEuEos ===
                      TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                      <>
                        <FieldOverforingsgrunnlagUtenforEuEosAnnet />
                        <FormError fieldName='overforingsgrunnlagUtenforEuEosAnnet' akselStyling />
                      </>
                    )}

                    <FieldLandDataOverforesTil formikBag={formikBag} />
                    <FormError fieldName='landDataOverforesTil' akselStyling />
                  </>
                )}

                {Object.values(formikBag.errors).some(Boolean) && (
                  <ErrorSummary
                    ref={errorSummaryRef}
                    heading='Du må rette disse feilene før du kan fortsette'
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
              </Form>
            </Modal.Body>

            <Modal.Footer>
              <div className='flex justify-end gap-4'>
                <div className='self-end'>{errorMessage && <p>{errorMessage}</p>}</div>
                <Button type='button' variant='secondary' onClick={onClose}>
                  Avbryt
                </Button>
                <Button
                  type='submit'
                  form='modal-databehandler-form'
                  variant='primary'
                  onClick={() => setValidateOnBlur(true)}
                >
                  Lagre
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  )
}

export default DatabehandlerModal
