import React from 'react'
import { Block, BlockProps } from 'baseui/block'
import { ModalLabel } from '../../common/ModalSchema'
import { theme } from '../../../util'
import { DpProcessFormValues } from '../../../constants'
import { FormikProps } from 'formik'
import FieldDpProcessDepartment from './FieldDpProcessDepartment'
import FieldProductTeam from '../../common/form/FieldProductTeam'
import FieldSubDepartments from '../../common/FieldSubDepartments'

type FieldDpProcessAffiliationProps = {
  rowBlockProps: BlockProps
  formikBag: FormikProps<DpProcessFormValues>
  showResponsibleSelect: boolean
  setShowResponsibleSelect: Function
}

const FieldDpProcessAffiliation = (props: FieldDpProcessAffiliationProps) => {
  const { rowBlockProps, formikBag, showResponsibleSelect, setShowResponsibleSelect } = props

  return (
    <>
      <Block display="flex" width="100%" justifyContent="space-between">
        <Block width="48%">
          <ModalLabel label='Avdeling' tooltip='Angi hvilken avdeling som har hovedansvar for behandlingen.' />
        </Block>
        <Block width="48%">
          <ModalLabel label='Linja' tooltip='Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres.' />
        </Block>
      </Block>

      <Block display="flex" width="100%" justifyContent="space-between">
        <Block width="48%">
          <FieldDpProcessDepartment department={formikBag.values.affiliation.department} />
        </Block>
        <Block width="48%">
          <FieldSubDepartments formikBag={formikBag} />
        </Block>
      </Block>

      <Block display="flex" width="100%" justifyContent="space-between" marginTop={theme.sizing.scale400}>
        <Block width="48%">
          <ModalLabel label='Team (Oppslag i Teamkatalogen)' tooltip='Angi hvilke team som har forvaltningsansvaret for IT-systemene.' fullwidth={true} />
        </Block>
      </Block>

      <Block display="flex" width="100%" justifyContent="space-between">
        <Block width="48%">
          <FieldProductTeam productTeams={formikBag.values.affiliation.productTeams} fieldName="affiliation.productTeams" />
        </Block>
      </Block>
    </>
  )
}

export default FieldDpProcessAffiliation
