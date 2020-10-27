import React, {KeyboardEvent, useState} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {Block, BlockProps} from "baseui/block";
import {Field, FieldProps, Form, Formik} from "formik";
import CustomizedModalBlock from "../common/CustomizedModalBlock";
import {Error, ModalLabel} from "../common/ModalSchema";
import {intl, theme} from "../../util";
import {DpProcessFormValues} from "../../constants";
import {Input, SIZE as InputSIZE} from "baseui/input";
import {Panel, PanelOverrides, StatelessAccordion} from "baseui/accordion";
import PanelTitle from "../Process/common/PanelTitle";
import BoolField from "../Process/common/BoolField";
import FieldDpProcessDataProcessingAgreements from "./common/FieldDpProcessDataProcessingAgreements";
import FieldDescription from "./common/FieldDescription";
import RetentionItems from "./common/RetentionItems";
import FieldPurposeDescription from "./common/FieldPurposeDescription";
import FieldDpProcessSubDataProcessor from "./common/FieldDpProcessSubDataProcessor";
import FieldDpProcessAffiliation from "./common/FieldDpProcessAffiliation";
import {dpProcessSchema} from "../common/schema";
import {FieldDpProcessDates} from "./common/FieldDpProcessDates";
import {Button, KIND} from "baseui/button";
import FieldProduct from "../common/FieldProduct";
import FieldDpProcessExternalProcessResponsible from "./common/FieldDpProcessExternalProcessResponsible";
import {RadioBoolButton} from "../common/Radio";

type ModalDpProcessProps = {
  initialValues: DpProcessFormValues
  errorOnCreate?: string
  isOpen: boolean
  submit: Function
  onClose: () => void
}

const modalHeaderProps: BlockProps = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
}

const modalBlockProps: BlockProps = {
  width: '960px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const panelOverrides: PanelOverrides<any> = {
  Header: {
    style: {
      paddingLeft: '0'
    }
  },
  Content: {
    style: {
      backgroundColor: theme.colors.white,
    }
  },
  ToggleIcon: {
    component: () => null
  }
}

const DpProcessModal = (props: ModalDpProcessProps) => {

  const [expanded, setExpanded] = useState<React.Key[]>([])
  const [showResponsibleSelect, setShowResponsibleSelect] = React.useState<boolean>(!!props.initialValues.externalProcessResponsible)
  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll={true}
    >
      <Block {...modalBlockProps}>
        <Formik
          onSubmit={values => {
            props.submit(values)
          }}
          initialValues={props.initialValues}
          validationSchema={dpProcessSchema}
        >
          {
            formikBag => (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>
                  <Block {...modalHeaderProps}>
                    {intl.dpProcessPageTitle}
                  </Block>
                </ModalHeader>
                <ModalBody>
                  <CustomizedModalBlock first>
                    <ModalLabel label={intl.name} tooltip={intl.nameDpProcessHelpText}/>
                    <Field
                      name='name'

                      render={({field, form}: FieldProps<string, DpProcessFormValues>) => (
                        <Input {...field} type='input' size={InputSIZE.default} autoFocus
                               error={!!form.errors.name && form.touched.name}/>
                      )}
                    />
                  </CustomizedModalBlock>
                  <Error fieldName={'name'}/>


                  <CustomizedModalBlock>
                    <ModalLabel label={intl.externalProcessResponsible} tooltip={intl.externalProcessResponsibleDpProcessHelpText}/>
                    <Block width={'100%'}>
                      {showResponsibleSelect &&
                      <FieldDpProcessExternalProcessResponsible thirdParty={formikBag.values.externalProcessResponsible}
                                                                hideSelect={() => setShowResponsibleSelect(false)}/>}
                      {!showResponsibleSelect && <RadioBoolButton
                        value={showResponsibleSelect}
                        setValue={(b) => setShowResponsibleSelect(b!)}
                        omitUndefined
                      />}
                    </Block>
                  </CustomizedModalBlock>


                  <CustomizedModalBlock>
                    <ModalLabel label={intl.description} tooltip={intl.descriptionDpProcessHelpText}/>
                    <FieldDescription/>
                  </CustomizedModalBlock>
                  <Error fieldName='description'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.purpose} tooltip={intl.purposeDpProcessHelpText}/>
                    <FieldPurposeDescription/>
                  </CustomizedModalBlock>
                  <Error fieldName='purposeDescription'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.validityOfProcess}/>
                    <FieldDpProcessDates showDates={true} showLabels={true} rowBlockProps={rowBlockProps}/>
                  </CustomizedModalBlock>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.article9} tooltip={intl.article9DpProcessHelpText}/>
                    <BoolField fieldName='art9' value={formikBag.values.art9}/>
                  </Block>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.article10}/>
                    <BoolField fieldName='art10' value={formikBag.values.art10}/>
                  </Block>

                  <CustomizedModalBlock>
                    <ModalLabel label={intl.system} tooltip={intl.systemHelpText}/>
                    <FieldProduct formikBag={formikBag}/>
                  </CustomizedModalBlock>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.dataProcessorAgreement}/>
                    <FieldDpProcessDataProcessingAgreements formikBag={formikBag}/>
                  </Block>
                  <Error fieldName='dataProcessingAgreements'/>

                  <StatelessAccordion overrides={{
                    Root: {
                      style: {
                        marginTop: '25px'
                      }
                    }
                  }} expanded={expanded} onChange={e => setExpanded(e.expanded)}>
                    <Panel key='organizing'
                           title={<ModalLabel label={<PanelTitle title={intl.organizing} expanded={expanded.indexOf('organizing') >= 0}/>}/>}
                           overrides={{...panelOverrides}}
                    >
                      <FieldDpProcessAffiliation
                        rowBlockProps={rowBlockProps}
                        formikBag={formikBag}
                        showResponsibleSelect={showResponsibleSelect}
                        setShowResponsibleSelect={setShowResponsibleSelect}
                      />
                    </Panel>

                    <Panel key='subDataProcessor'
                           title={<PanelTitle title={intl.subDataProcessor} expanded={expanded.indexOf('subDataProcessor') >= 0}/>}
                           overrides={{...panelOverrides}}
                    >
                      <FieldDpProcessSubDataProcessor rowBlockProps={rowBlockProps} formikBag={formikBag}/>
                    </Panel>

                    <Panel key='retention'
                           title={<PanelTitle title={intl.retention} expanded={expanded.indexOf('retention') >= 0}/>}
                           overrides={{...panelOverrides}}
                    >
                      <RetentionItems formikBag={formikBag}/>
                    </Panel>

                  </StatelessAccordion>


                </ModalBody>
                <ModalFooter style={{
                  borderTop: 0
                }}>
                  <Block display='flex' justifyContent='flex-end'>
                    <Block alignSelf='flex-end'>
                      {props.errorOnCreate && <p>{props.errorOnCreate}</p>}
                    </Block>
                    <Button type='button' kind={KIND.minimal} onClick={props.onClose}>{intl.abort}</Button>
                    <ModalButton type='submit'>{intl.save}</ModalButton>
                  </Block>
                </ModalFooter>
              </Form>
            )
          }
        </Formik>
      </Block>
    </Modal>
  )
}

export default DpProcessModal
