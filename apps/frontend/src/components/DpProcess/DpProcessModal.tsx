import { Accordion, Button, Modal, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../constants'
import { CodelistService } from '../../service/Codelist'
import { disableEnter } from '../../util/helper-functions'
import BoolField from '../Process/common/BoolField'
import CustomizedModalBlock from '../common/CustomizedModalBlock'
import FieldProduct from '../common/FieldProduct'
import { Error, ModalLabel } from '../common/ModalSchema'
import { dpProcessSchema } from '../common/schemaValidation'
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
  const [codelistUtils] = CodelistService()
  const [expanded, setExpanded] = useState<string>('')

  const onOpenChangeAction = (open: boolean, key: string): void =>
    open ? setExpanded(key) : setExpanded('')

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      header={{ heading: 'Behandlinger hvor Nav er databehandler' }}
      width="960px"
    >
      <Formik
        onSubmit={(values) => {
          submit(values)
        }}
        initialValues={initialValues}
        validationSchema={dpProcessSchema()}
      >
        {(formikBag) => (
          <>
            <Modal.Body>
              <Form id="modal-dp-process-form" onKeyDown={disableEnter}>
                <CustomizedModalBlock first>
                  <ModalLabel
                    label="Navn"
                    tooltip="Et kort navn som beskriver hva behandlingen går ut på, f.eks. saksbehandling eller tilgangsstyring."
                  />
                  <Field name="name">
                    {({ field, form }: FieldProps<string, IDpProcessFormValues>) => (
                      <TextField
                        className="w-full"
                        label="name"
                        hideLabel
                        {...field}
                        error={!!form.errors.name && form.touched.name}
                      />
                    )}
                  </Field>
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

                <div className="w-full mt-4">
                  <ModalLabel
                    label="Behandles det særlige kategorier av personopplysninger?"
                    tooltip="Med særlige kategorier personopplysninger menes opplysninger om helse, etnisk opprinnelse, politikk, religion og filosofisk overbevisning, fagforeningsmedlemskap, genetikk og biometri, seksuelle forhold og legning."
                    fullwidth
                  />
                  <div className="mt-2">
                    <BoolField
                      fieldName="art9"
                      value={formikBag.values.art9}
                      direction="horizontal"
                    />
                  </div>
                </div>

                <div className="w-full mt-4">
                  <ModalLabel
                    label="Behandles det personopplysninger om straffedommer og lovovertredelser?"
                    fullwidth
                  />
                  <div className="mt-2">
                    <BoolField
                      fieldName="art10"
                      value={formikBag.values.art10}
                      direction="horizontal"
                    />
                  </div>
                </div>

                <CustomizedModalBlock>
                  <ModalLabel
                    label="System"
                    tooltip="Angi hvilke systemer som er primært i bruk i denne behandlingen."
                  />
                  <FieldProduct formikBag={formikBag} codelistUtils={codelistUtils} />
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
                        codelistUtils={codelistUtils}
                      />
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item
                    open={expanded === 'subDataProcessor'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'subDataProcessor')}
                  >
                    <Accordion.Header className="z-0">Underdatabehandler</Accordion.Header>

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
                    <Accordion.Header className="z-0">Lagringsbehov</Accordion.Header>
                    <Accordion.Content>
                      <RetentionItems formikBag={formikBag} />
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Form>
            </Modal.Body>

            <Modal.Footer
              style={{
                borderTop: 0,
              }}
            >
              <div className="flex justify-end">
                <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                <Button type="button" variant="tertiary" onClick={() => onClose()}>
                  Avbryt
                </Button>
                <Button type="submit" form="modal-dp-process-form">
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

export default DpProcessModal
