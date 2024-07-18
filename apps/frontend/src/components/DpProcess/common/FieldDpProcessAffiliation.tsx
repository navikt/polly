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
      <div className="flex w-full justify-between">
        <div className="w-[48%]">
          <ModalLabel label='Avdeling' tooltip='Angi hvilken avdeling som har hovedansvar for behandlingen.' />
        </div>
        <div className="w-[48%]">
          <ModalLabel label='Linja' tooltip='Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres.' />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="w-[48%]">
          <FieldDpProcessDepartment department={formikBag.values.affiliation.department} />
        </div>
        <div className="w-[48%]">
          <FieldSubDepartments formikBag={formikBag} />
        </div>
      </div>

      <div className="flex w-full justify-between mt-2.5">
        <div className="w-[48%]">
          <ModalLabel label='Team (Oppslag i Teamkatalogen)' tooltip='Angi hvilke team som har forvaltningsansvaret for IT-systemene.' fullwidth={true} />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="w-[48%]">
          <FieldProductTeam productTeams={formikBag.values.affiliation.productTeams} fieldName="affiliation.productTeams" />
        </div>
      </div>
    </>
  )
}

export default FieldDpProcessAffiliation
