import { Panel, PanelOverrides, StatelessAccordion } from 'baseui/accordion'
import { Button, KIND } from 'baseui/button'
import { Input, SIZE as InputSIZE } from 'baseui/input'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Key, useEffect, useState } from 'react'
import { getResourcesByIds } from '../../api/GetAllApi'
import { IProcessorFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { theme } from '../../util'
import { disableEnter } from '../../util/helper-functions'
import BoolField from '../Process/common/BoolField'
import PanelTitle from '../Process/common/PanelTitle'
import CustomizedModalBlock from '../common/CustomizedModalBlock'
import { Error, ModalLabel } from '../common/ModalSchema'
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

const ProcessorModal = (props: TModalProcessorProps) => {
  const { title, isOpen, initialValues, errorMessage, submit, onClose } = props
  const [expanded, setExpanded] = useState<Key[]>([])
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
      isOpen={isOpen}
      closeable={false}
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
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
              <ModalHeader>
                <div className="flex justify-center mb-8">{title}</div>
              </ModalHeader>
              <ModalBody>
                <CustomizedModalBlock>
                  <ModalLabel label="Navn på databehandler" />
                  <Field name="name">
                    {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
                      <Input
                        {...field}
                        type="input"
                        size={InputSIZE.default}
                        error={!!form.errors.name && form.touched.name}
                      />
                    )}
                  </Field>
                </CustomizedModalBlock>
                <Error fieldName={'name'} />

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Ref. på databehandleravtale"
                    tooltip="Referanse til avtalen, gjerne URL til avtalen i WebSak e.l."
                  />
                  <Field name="contract">
                    {({ field, form }: FieldProps<string, IProcessorFormValues>) => (
                      <Input
                        {...field}
                        type="input"
                        size={InputSIZE.default}
                        error={!!form.errors.contract && form.touched.contract}
                      />
                    )}
                  </Field>
                </CustomizedModalBlock>
                <Error fieldName={'contract'} />

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Avtaleeier"
                    tooltip="Den som formelt står som eier av avtalen med databehandler."
                  />
                  <FieldContractOwner contractOwner={formikBag.values.contractOwner} />
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Fagansvarlig"
                    tooltip="De(n) som kan svare ut detaljer knyttet til avtalen og operasjonalisering av denne."
                  />
                  <FieldOperationalContractManagers
                    formikBag={formikBag}
                    resources={operationalContractManagers}
                  />
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Merknad"
                    tooltip="Eventuelle vesentlige merknader/begrensninger som bruker av databehandleren må være ekstra oppmerksom på."
                  />
                  <FieldNote />
                </CustomizedModalBlock>

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
                    key={'transfer'}
                    title={
                      <PanelTitle
                        title="Overføres data til utlandet"
                        expanded={expanded.indexOf('transfer') >= 0}
                      />
                    }
                    overrides={{ ...panelOverrides }}
                  >
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
                  </Panel>
                </StatelessAccordion>
              </ModalBody>
              <ModalFooter
                style={{
                  borderTop: 0,
                }}
              >
                <div className="flex justify-end">
                  <div className="self-end">{errorMessage && <p>{errorMessage}</p>}</div>
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

export default ProcessorModal
