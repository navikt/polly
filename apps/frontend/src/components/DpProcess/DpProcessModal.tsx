import { Panel, PanelOverrides, StatelessAccordion } from 'baseui/accordion'
import { BlockProps } from 'baseui/block'
import { Button, KIND } from 'baseui/button'
import { Input, SIZE as InputSIZE } from 'baseui/input'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Key, useState } from 'react'
import { DpProcessFormValues } from '../../constants'
import { theme } from '../../util'
import { disableEnter } from '../../util/helper-functions'
import BoolField from '../Process/common/BoolField'
import PanelTitle from '../Process/common/PanelTitle'
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

type ModalDpProcessProps = {
  initialValues: DpProcessFormValues
  errorOnCreate?: string
  isOpen: boolean
  submit: Function
  onClose: () => void
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const panelOverrides: PanelOverrides = {
  Header: {
    style: {
      paddingLeft: '0',
    },
  },
  Content: {
    style: {
      backgroundColor: theme.colors.white,
    },
  },
  ToggleIcon: {
    component: () => null,
  },
}

const DpProcessModal = (props: ModalDpProcessProps) => {
  const { initialValues, errorOnCreate, isOpen, submit, onClose } = props
  const [expanded, setExpanded] = useState<Key[]>([])
  const [showResponsibleSelect, setShowResponsibleSelect] = useState<boolean>(!!props.initialValues.externalProcessResponsible)

  return (
    <Modal isOpen={isOpen} onClose={onClose} animate size={SIZE.auto} role={ROLE.dialog}>
      <div className="w-[960px] pr-8 pl-8">
        <Formik
          onSubmit={(values) => {
            submit(values)
          }}
          initialValues={initialValues}
          validationSchema={dpProcessSchema()}
        >
          {(formikBag) => (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>
                <div className="flex justify-center mb-8">Behandlinger hvor NAV er databehandler</div>
              </ModalHeader>
              <ModalBody>
                <CustomizedModalBlock first>
                  <ModalLabel label="Navn" tooltip="Et kort navn som beskriver hva behandlingen går ut på, f.eks. saksbehandling eller tilgangsstyring." />
                  <Field
                    name="name"
                    render={({ field, form }: FieldProps<string, DpProcessFormValues>) => (
                      <Input {...field} type="input" size={InputSIZE.default} autoFocus error={!!form.errors.name && form.touched.name} />
                    )}
                  />
                </CustomizedModalBlock>
                <Error fieldName={'name'} />

                <CustomizedModalBlock>
                  <ModalLabel label="Behandlingsansvarlig" tooltip="Oppgi navn på den behandlingsansvarlige virksomheten." />
                  <div className="w-full">
                    <FieldDpProcessExternalProcessResponsible thirdParty={formikBag.values.externalProcessResponsible} />
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
                  <ModalLabel label="Formål" tooltip="Beskriv formålet med å bruke personopplysninger i denne behandlingen." />
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
                  <ModalLabel label="System" tooltip="Angi hvilke systemer som er primært i bruk i denne behandlingen." />
                  <FieldProduct formikBag={formikBag} />
                </CustomizedModalBlock>

                <div className="flex w-full mt-4">
                  <ModalLabel label="Ref. til databehandleravtale" />
                  <FieldDpProcessDataProcessingAgreements formikBag={formikBag} />
                </div>
                <Error fieldName="dataProcessingAgreements" />

                <StatelessAccordion
                  overrides={{
                    Root: {
                      style: {
                        marginTop: '25px',
                      },
                    },
                  }}
                  expanded={expanded}
                  onChange={(event) => setExpanded(event.expanded)}
                >
                  <Panel
                    key="organizing"
                    title={<ModalLabel label={<PanelTitle title="Organisering" expanded={expanded.indexOf('organizing') >= 0} />} />}
                    overrides={{ ...panelOverrides }}
                  >
                    <FieldDpProcessAffiliation
                      rowBlockProps={rowBlockProps}
                      formikBag={formikBag}
                      showResponsibleSelect={showResponsibleSelect}
                      setShowResponsibleSelect={setShowResponsibleSelect}
                    />
                  </Panel>

                  <Panel
                    key="subDataProcessor"
                    title={<PanelTitle title="Underdatabehandler" expanded={expanded.indexOf('subDataProcessor') >= 0} />}
                    overrides={{ ...panelOverrides }}
                  >
                    <FieldDpProcessSubDataProcessor formikBag={formikBag} initialValues={initialValues} />
                  </Panel>

                  <Panel key="retention" title={<PanelTitle title="Lagringsbehov" expanded={expanded.indexOf('retention') >= 0} />} overrides={{ ...panelOverrides }}>
                    <RetentionItems formikBag={formikBag} />
                  </Panel>
                </StatelessAccordion>
              </ModalBody>
              <ModalFooter
                style={{
                  borderTop: 0,
                }}
              >
                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" kind={KIND.tertiary} onClick={onClose}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Lagre</ModalButton>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default DpProcessModal
