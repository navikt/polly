import { Accordion, Button, Modal, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { getResourcesByIds, useTeamResourceSearchOptions } from '../../api/GetAllApi'
import { IProcessorFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { disableEnter } from '../../util/helper-functions'
import BoolField from '../Process/common/BoolField'
import CustomSearchSelect from '../common/AsyncSelectComponents'
import { Error, ModalLabel } from '../common/ModalSchema'
import { dataProcessorSchema } from '../common/schemaValidation'
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
  const [operationalContractManagers, setOperationalContractManagers] = useState(
    new Map<string, string>()
  )

  useEffect(() => {
    ;(async () => {
      if (
        initialValues.operationalContractManagers &&
        initialValues.operationalContractManagers?.length > 0
      ) {
        const result = await getResourcesByIds(initialValues.operationalContractManagers)
        const newConMans = new Map<string, string>()
        result.forEach((result) => newConMans.set(result.navIdent, result.fullName))
        setOperationalContractManagers(newConMans)
      }
    })()
  }, [])

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      header={{
        heading: title,
        closeButton: false,
      }}
    >
      <div className="w-[960px] px-8">
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
                      className="w-full"
                      label="Ref. på databehandleravtale"
                      description="Referanse til avtalen, gjerne URL til avtalen i Public 360 e.l."
                      {...field}
                      error={!!form.errors.contract && form.touched.contract}
                    />
                  )}
                </Field>

                <Error fieldName={'contract'} />

                <div className="w-full">
                  <Field name="contractOwner">
                    {({ form }: FieldProps<string, IProcessorFormValues>) => (
                      <CustomSearchSelect
                        ariaLabel="Avtaleeier"
                        placeholder=""
                        onChange={(event: any) => {
                          if (event) {
                            form.setFieldValue('contractOwner', event.id)
                          }
                        }}
                        loadOptions={useTeamResourceSearchOptions}
                      />
                    )}
                  </Field>
                </div>

                <ModalLabel
                  label="Fagansvarlig"
                  tooltip="De(n) som kan svare ut detaljer knyttet til avtalen og operasjonalisering av denne."
                />
                <FieldOperationalContractManagers
                  formikBag={formikBag}
                  resources={operationalContractManagers}
                />

                <ModalLabel
                  label="Merknad"
                  tooltip="Eventuelle vesentlige merknader/begrensninger som bruker av databehandleren må være ekstra oppmerksom på."
                />
                <FieldNote />

                <Accordion>
                  <Accordion.Item>
                    <Accordion.Header>
                      <span>Overføres data til utlandet</span>
                    </Accordion.Header>
                    <Accordion.Content>
                      <div className="flex w-full mt-0">
                        <ModalLabel label="Behandler databehandler personopplysninger utenfor EU/EØS?" />
                        <BoolField fieldName="outsideEU" value={formikBag.values.outsideEU} />
                      </div>

                      {formikBag.values.outsideEU && (
                        <>
                          <div className="flex w-full mt-4">
                            <ModalLabel label="Overføringsgrunnlag for behandling utenfor EU/EØS" />
                            <FieldTransferGroundsOutsideEU
                              code={formikBag.values.transferGroundsOutsideEU}
                            />
                          </div>
                          <Error fieldName="transferGroundsOutsideEU" />

                          {formikBag.values.transferGroundsOutsideEU ===
                            TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                            <div className="flex w-full mt-4">
                              <ModalLabel
                                label="Andre overføringsgrunnlag"
                                tooltip='Du har valgt at overføringsgrunnlaget er "annet", spesifiser grunnlaget her.'
                              />
                              <FieldTransferGroundsOutsideEUOther />
                            </div>
                          )}
                          <Error fieldName="transferGroundsOutsideEUOther" />

                          <div className="flex w-full mt-4">
                            <ModalLabel
                              label="Land"
                              tooltip="I hvilke(t) land lagrer databehandleren personopplysninger i?"
                            />
                            <FieldCountries formikBag={formikBag} />
                          </div>
                          <Error fieldName="countries" />
                        </>
                      )}
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-end">
                  <div className="self-end">{errorMessage && <p>{errorMessage}</p>}</div>
                  <Button type="button" variant="tertiary" onClick={onClose}>
                    Avbryt
                  </Button>
                  <Button type="submit">Lagre</Button>
                </div>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default ProcessorModal
