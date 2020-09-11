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
import {codelist} from "../../service/Codelist";
import FieldProductTeam from "../common/form/FieldProductTeam";
import {RadioBoolButton} from "../common/Radio";
import FieldDpProcessDepartment from "./common/FieldDpProcessDepartment";
import FieldDpProcessExternalProcessResponsible from "./common/FieldDpProcessExternalProcessResponsible";
import FieldDpProcessSubDepartment from "./common/FieldDpProcessSubDepartment";
import BoolField from "../Process/common/BoolField";

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
          onSubmit={values => console.log(values)}
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

                  <Block {...rowBlockProps}>
                    <ModalLabel label={"Article 9"}/>
                    <BoolField fieldName='art9' value={formikBag.values.art9} justifyContent={"flex-end"}/>
                  </Block>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={"Article 10"}/>
                    <BoolField fieldName='art10' value={formikBag.values.art10} justifyContent={"flex-end"}/>
                  </Block>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={"DataProcess Agreement"}/>
                    <BoolField fieldName='dataProcessingAgreement' value={formikBag.values.dataProcessingAgreement} justifyContent={"flex-end"}/>
                  </Block>


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
                      <Block display='flex' width='100%' justifyContent='space-between'>
                        <Block width='48%'>
                          <ModalLabel label={intl.department} tooltip={intl.departmentHelpText}/></Block>
                        {codelist.showSubDepartment(formikBag.values.affiliation.department) && (
                          <Block width='48%'><ModalLabel label={intl.subDepartment} tooltip={intl.subDepartmentHelpText}/></Block>
                        )}
                      </Block>

                      <Block display='flex' width='100%' justifyContent='space-between'>
                        <Block width='48%'>
                          <FieldDpProcessDepartment department={formikBag.values.affiliation.department}/>
                        </Block>
                        {codelist.showSubDepartment(formikBag.values.affiliation.department) && (
                          <Block width='48%'>
                            <FieldDpProcessSubDepartment formikBag={formikBag}/>
                          </Block>
                        )}
                      </Block>

                      <Block display='flex' width='100%' justifyContent='space-between' marginTop={theme.sizing.scale400}>
                        <Block width='48%'><ModalLabel label={intl.productTeamFromTK} tooltip={intl.productTeamFromTKHelpText}/></Block>
                        <Block width='48%'>
                          <ModalLabel fullwidth label={intl.commonExternalProcessResponsible} tooltip={intl.commonExternalProcessResponsibleHelpText}/>
                        </Block>
                      </Block>

                      <Block display='flex' width='100%' justifyContent='space-between'>
                        <Block width='48%'>
                          <FieldProductTeam productTeams={formikBag.values.affiliation.productTeams} fieldName='affiliation.productTeams'/>
                        </Block>
                        <Block width='48%'>
                          {showResponsibleSelect && <FieldDpProcessExternalProcessResponsible thirdParty={formikBag.values.externalProcessResponsible}
                                                                                              hideSelect={() => setShowResponsibleSelect(false)}/>}
                          {!showResponsibleSelect && <RadioBoolButton
                            value={showResponsibleSelect}
                            setValue={(b) => setShowResponsibleSelect(b!)}
                            omitUndefined
                          />}
                        </Block>
                      </Block>
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
