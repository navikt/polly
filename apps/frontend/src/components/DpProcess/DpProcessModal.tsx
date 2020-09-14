import React, {KeyboardEvent, useState} from "react";
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from "baseui/modal";
import {Block, BlockProps} from "baseui/block";
import {Field, FieldProps, Form, Formik} from "formik";
import {dpProcessToFormValuesConverter} from "../../api/DpProcessApi";
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

type ModalDpProcessProps = {
  initialValues: DpProcessFormValues
  isOpen: boolean
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
          onSubmit={values =>
            //TODO :-)
            console.log(values)
          }
          initialValues={dpProcessToFormValuesConverter({})}
          //TODO validationSchema
        >
          {
            formikBag => (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>
                  <Block {...modalHeaderProps}>
                    DpProcess Header
                  </Block>
                </ModalHeader>
                <ModalBody>
                  <CustomizedModalBlock>
                    <ModalLabel label={intl.name}/>
                    <Field
                      name='name'
                      render={({field, form}: FieldProps<string, DpProcessFormValues>) => (
                        <Input {...field} type='input' size={InputSIZE.default} autoFocus
                               error={!!form.errors.name && form.touched.name}/>
                      )}
                    />
                  </CustomizedModalBlock>
                  <Error fieldName='name'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={"Description"}/>
                    <FieldDescription/>
                  </CustomizedModalBlock>
                  <Error fieldName='description'/>

                  <CustomizedModalBlock>
                    <ModalLabel label={"Purpose Description"}/>
                    <FieldPurposeDescription/>
                  </CustomizedModalBlock>
                  <Error fieldName='purposeDescription'/>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={"Article 9"}/>
                    <BoolField fieldName='art9' value={formikBag.values.art9} justifyContent={"flex-end"}/>
                  </Block>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={"Article 10"}/>
                    <BoolField fieldName='art10' value={formikBag.values.art10} justifyContent={"flex-end"}/>
                  </Block>

                  <Block {...rowBlockProps} marginTop={0}>
                    <ModalLabel label={intl.isDataProcessorUsed} tooltip={intl.dataProcessorHelpText}/>
                    <BoolField fieldName='dataProcessingAgreement'
                               value={formikBag.values.dataProcessingAgreement}/>
                  </Block>

                  {formikBag.values.dataProcessingAgreement && <>
                    <Block {...rowBlockProps}>
                      <ModalLabel label={intl.dataProcessorAgreement}/>
                      <FieldDpProcessDataProcessingAgreements formikBag={formikBag}/>
                    </Block>
                    <Error fieldName='dataProcessingAgreements'/>
                  </>
                  }

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
                           title={<PanelTitle title={intl.dataProcessor} expanded={expanded.indexOf('subDataProcessor') >= 0}/>}
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
                    {/*<Block alignSelf='flex-end'>{errorOnCreate && <p>{errorOnCreate}</p>}</Block>*/}
                    {/*<Button type='button' kind={KIND.minimal} onClick={onClose}>{intl.abort}</Button>*/}
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
