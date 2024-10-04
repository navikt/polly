import { Accordion, Button, Modal, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../constants'
import { disableEnter } from '../../util/helper-functions'
import BoolField from '../Process/common/BoolField'
import CustomizedModalBlock from '../common/CustomizedModalBlock'
import FieldProduct from '../common/FieldProduct'
import { Error, ModalLabel } from '../common/ModalSchema'
import { dpProcessSchema } from '../common/schema'
import FieldDescription from './common/FieldDescription'
import FieldDpProcessAffiliation from './common/FieldDpProcessAffiliation'
import FieldDpProcessDataProcessingAgreements from './common/FieldDpProcessDataProcessingAgreements'
import { FieldDpProcessDates } from './common/FieldDpProcessDates'
import FieldDpProcessExternalProcessResponsible from './common/FieldDpProcessExternalProcessResponsible'
import FieldDpProcessSubDataProcessor from './common/FieldDpProcessSubDataProcessor'
import FieldPurposeDescription from './common/FieldPurposeDescription'
import RetentionItems from './common/RetentionItems'

type TModalDpProcessProps = {
  initialValues: IDpProcessFormValues
  errorOnCreate?: string
  isOpen: boolean
  submit: (dpProcess: IDpProcessFormValues) => Promise<void>
  onClose: () => void
}

const DpProcessModal = (props: TModalDpProcessProps) => {
  const { initialValues, errorOnCreate, isOpen, submit, onClose } = props
  const [expanded, setExpanded] = useState<string>('')
  const [showResponsibleSelect, setShowResponsibleSelect] = useState<boolean>(
    !!props.initialValues.externalProcessResponsible
  )

  const onOpenChangeAction = (open: boolean, key: string): void =>
    open ? setExpanded(key) : setExpanded('')

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      header={{ heading: 'Behandlinger hvor NAV er databehandler' }}
      width="960px"
    >
      <div>
        <Formik
          onSubmit={(values) => {
            submit(values)
          }}
          initialValues={initialValues}
          validationSchema={dpProcessSchema()}
        >
          {(formikBag) => (
            <Form onKeyDown={disableEnter}>
              <Modal.Body>
                <CustomizedModalBlock first>
                  <ModalLabel
                    label="Navn"
                    tooltip="Et kort navn som beskriver hva behandlingen går ut på, f.eks. saksbehandling eller tilgangsstyring."
                  />
                  <Field
                    name="name"
                    render={({ field, form }: FieldProps<string, IDpProcessFormValues>) => (
                      <TextField
                        className="w-full"
                        label="name"
                        hideLabel
                        {...field}
                        error={!!form.errors.name && form.touched.name}
                      />
                    )}
                  />
                </CustomizedModalBlock>
                <Error fieldName={'name'} />

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Behandlingsansvarlig"
                    tooltip="Oppgi navn på den behandlingsansvarlige virksomheten."
                  />
                  <div className="w-full">
                    <FieldDpProcessExternalProcessResponsible
                      thirdParty={formikBag.values.externalProcessResponsible}
                    />
                  </div>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Beskrivelse"
                    tooltip="Beskriv behandlingen NAV gjør på vegne av den behandlingsansvarlige, f.eks. innsamling og lagring av personopplysninger."
                  />
                  <FieldDescription />
                </CustomizedModalBlock>
                <Error fieldName="description" />

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Formål"
                    tooltip="Beskriv formålet med å bruke personopplysninger i denne behandlingen."
                  />
                  <FieldPurposeDescription />
                </CustomizedModalBlock>
                <Error fieldName="purposeDescription" />

                <CustomizedModalBlock>
                  <ModalLabel label="Gyldighetsperiode for behandlingen" />
                  <FieldDpProcessDates showDates={true} showLabels={true} />
                </CustomizedModalBlock>

                <div className="flex w-full mt-4">
                  <ModalLabel
                    label="Behandles det særlige kategorier av personopplysninger?"
                    tooltip="Med særlige kategorier personopplysninger menes opplysninger om helse, etnisk opprinnelse, politikk, religion og filosofisk overbevisning, fagforeningsmedlemskap, genetikk og biometri, seksuelle forhold og legning."
                  />
                  <BoolField fieldName="art9" value={formikBag.values.art9} />
                </div>

                <div className="flex w-full mt-4">
                  <ModalLabel label="Behandles det personopplysninger om straffedommer og lovovertredelser?" />
                  <BoolField fieldName="art10" value={formikBag.values.art10} />
                </div>

                <CustomizedModalBlock>
                  <ModalLabel
                    label="System"
                    tooltip="Angi hvilke systemer som er primært i bruk i denne behandlingen."
                  />
                  <FieldProduct formikBag={formikBag} />
                </CustomizedModalBlock>

                <div className="flex w-full mt-4">
                  <ModalLabel label="Ref. til databehandleravtale" />
                  <FieldDpProcessDataProcessingAgreements formikBag={formikBag} />
                </div>
                <Error fieldName="dataProcessingAgreements" />

                <Accordion className="mt-6">
                  <Accordion.Item
                    open={expanded === 'organizing'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'organizing')}
                  >
                    <Accordion.Header>Organisering</Accordion.Header>
                    <Accordion.Content>
                      <FieldDpProcessAffiliation
                        formikBag={formikBag}
                        showResponsibleSelect={showResponsibleSelect}
                        setShowResponsibleSelect={setShowResponsibleSelect}
                      />
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item
                    open={expanded === 'subDataProcessor'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'subDataProcessor')}
                  >
                    <Accordion.Header>Underdatabehandler</Accordion.Header>

                    <Accordion.Content>
                      <FieldDpProcessSubDataProcessor
                        formikBag={formikBag}
                        initialValues={initialValues}
                      />
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item
                    open={expanded === 'retention'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'retention')}
                  >
                    <Accordion.Header>Lagringsbehov</Accordion.Header>
                    <Accordion.Content>
                      <RetentionItems formikBag={formikBag} />
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Modal.Body>
              <Modal.Footer
                style={{
                  borderTop: 0,
                }}
              >
                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
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

export default DpProcessModal
