import React from 'react'
import {Block, BlockProps} from "baseui/block";
import {ModalLabel} from "../../common/ModalSchema";
import {intl, theme} from "../../../util";
import {DpProcessFormValues} from "../../../constants";
import {FormikProps} from "formik";
import {codelist} from "../../../service/Codelist";
import FieldDpProcessDepartment from "./FieldDpProcessDepartment";
import FieldDpProcessSubDepartment from "./FieldDpProcessSubDepartment";
import FieldProductTeam from "../../common/form/FieldProductTeam";

type FieldDpProcessAffiliationProps = {
  rowBlockProps: BlockProps
  formikBag: FormikProps<DpProcessFormValues>
  showResponsibleSelect: boolean
  setShowResponsibleSelect: Function
}

const FieldDpProcessAffiliation = (props: FieldDpProcessAffiliationProps) => {
  const {rowBlockProps, formikBag, showResponsibleSelect, setShowResponsibleSelect} = props

  return (
    <>

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
        <Block width='48%'><ModalLabel label={intl.productTeamFromTK} tooltip={intl.productTeamFromTKHelpText} fullwidth={true}/></Block>
      </Block>

      <Block display='flex' width='100%' justifyContent='space-between'>
        <Block width='48%'>
          <FieldProductTeam productTeams={formikBag.values.affiliation.productTeams} fieldName='affiliation.productTeams'/>
        </Block>
      </Block>

    </>
  )
}

export default FieldDpProcessAffiliation
