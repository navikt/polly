import * as React from 'react'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Block, BlockProps } from 'baseui/block'
import { Field, FieldProps, Form, Formik } from 'formik'
import { dataProcessorSchema } from '../common/schema'
import { Button, KIND } from 'baseui/button'
import { ProcessorFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER } from '../../constants'
import { disableEnter } from '../../util/helper-functions'
import CustomizedModalBlock from '../common/CustomizedModalBlock'
import { Error, ModalLabel } from '../common/ModalSchema'
import { Input, SIZE as InputSIZE } from 'baseui/input'
import FieldContractOwner from './components/FieldContractOwner'
import FieldOperationalContractManagers from './components/FieldOperationalContractManagers'
import FieldNote from './components/FieldNote'
import { Panel, PanelOverrides, StatelessAccordion } from 'baseui/accordion'
import PanelTitle from '../Process/common/PanelTitle'
import BoolField from '../Process/common/BoolField'
import FieldTransferGroundsOutsideEU from './components/FieldTransferGroundsOutsideEU'
import FieldTransferGroundsOutsideEUOther from './components/FieldTransferGroundsOutsideEUOther'
import FieldCountries from './components/FieldCountries'
import { getResourcesByIds } from '../../api'
import { theme } from '../../util'

type ModalProcessorProps = {
  title: string
  isOpen: boolean
  initialValues: ProcessorFormValues
  errorMessage: any | undefined
  submit: (processor: ProcessorFormValues) => void
  onClose: () => void
}

const modalBlockProps: BlockProps = {
  width: '960px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
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

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const ProcessorModal = (props: ModalProcessorProps) => {
  const [expanded, setExpanded] = useState<React.Key[]>([])
  const [operationalContractManagers, setOperationalContractManagers] = useState(new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (props.initialValues.operationalContractManagers && props.initialValues.operationalContractManagers?.length > 0) {
        const res = await getResourcesByIds(props.initialValues.operationalContractManagers)
        const newConMans = new Map<string, string>()
        res.forEach((r) => newConMans.set(r.navIdent, r.fullName))
        setOperationalContractManagers(newConMans)
      }
    })()
  }, [])

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} closeable={false} animate size={SIZE.auto} role={ROLE.dialog}>
      <Block {...modalBlockProps}>
        <Formik
          onSubmit={(values) => {
            props.submit(values)
          }}
          initialValues={props.initialValues}
          validationSchema={dataProcessorSchema()}
        >
          {(formikBag) => (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>
                <Block {...modalHeaderProps}>{props.title}</Block>
              </ModalHeader>
              <ModalBody>
                <CustomizedModalBlock>
                  <ModalLabel label='Navn på databehandler' />
                  <Field name="name">
                    {({ field, form }: FieldProps<string, ProcessorFormValues>) => (
                      <Input {...field} type="input" size={InputSIZE.default} autoFocus error={!!form.errors.name && form.touched.name} />
                    )}
                  </Field>
                </CustomizedModalBlock>
                <Error fieldName={'name'} />

                <CustomizedModalBlock>
                  <ModalLabel label='Ref. på databehandleravtale' tooltip='Referanse til avtalen, gjerne URL til avtalen i WebSak e.l.' />
                  <Field name="contract">
                    {({ field, form }: FieldProps<string, ProcessorFormValues>) => (
                      <Input {...field} type="input" size={InputSIZE.default} error={!!form.errors.contract && form.touched.contract} />
                    )}
                  </Field>
                </CustomizedModalBlock>
                <Error fieldName={'contract'} />

                <CustomizedModalBlock>
                  <ModalLabel label='Avtaleeier' tooltip='Den som formelt står som eier av avtalen med databehandler.' />
                  <FieldContractOwner contractOwner={formikBag.values.contractOwner} />
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label='Fagansvarlig'tooltip='De(n) som kan svare ut detaljer knyttet til avtalen og operasjonalisering av denne.' />
                  <FieldOperationalContractManagers formikBag={formikBag} resources={operationalContractManagers} />
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel label='Merknad' tooltip='Eventuelle vesentlige merknader/begrensninger som bruker av databehandleren må være ekstra oppmerksom på.' />
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
                  onChange={(e) => setExpanded(e.expanded)}
                >
                  <Panel key={'transfer'} title={<PanelTitle title='Overføres data til utlandet' expanded={expanded.indexOf('transfer') >= 0} />} overrides={{ ...panelOverrides }}>
                    <Block {...rowBlockProps} marginTop={0}>
                      <ModalLabel label='Behandler databehandler personopplysninger utenfor EU/EØS?' />
                      <BoolField fieldName="outsideEU" value={formikBag.values.outsideEU} />
                    </Block>

                    {formikBag.values.outsideEU && (
                      <>
                        <Block {...rowBlockProps}>
                          <ModalLabel label='Overføringsgrunnlag for behandling utenfor EU/EØS'/>
                          <FieldTransferGroundsOutsideEU code={formikBag.values.transferGroundsOutsideEU} />
                        </Block>
                        <Error fieldName="transferGroundsOutsideEU" />

                        {formikBag.values.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER && (
                          <Block {...rowBlockProps}>
                            <ModalLabel label='Andre overføringsgrunnlag' tooltip='Du har valgt at overføringsgrunnlaget er "annet", spesifiser grunnlaget her.' />
                            <FieldTransferGroundsOutsideEUOther />
                          </Block>
                        )}
                        <Error fieldName="transferGroundsOutsideEUOther" />

                        <Block {...rowBlockProps}>
                          <ModalLabel label='Land' tooltip='I hvilke(t) land lagrer databehandleren personopplysninger i?' />
                          <FieldCountries formikBag={formikBag} />
                        </Block>
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
                <Block display="flex" justifyContent="flex-end">
                  <Block alignSelf="flex-end">{props.errorMessage && <p>{props.errorMessage}</p>}</Block>
                  <Button type="button" kind={KIND.tertiary} onClick={props.onClose}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Lagre</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Block>
    </Modal>
  )
}

export default ProcessorModal
