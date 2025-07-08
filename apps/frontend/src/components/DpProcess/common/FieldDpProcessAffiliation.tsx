import { FormikProps } from 'formik'
import { IDpProcessFormValues } from '../../../constants'
import { ICodelistProps } from '../../../service/Codelist'
import FieldSubDepartments from '../../common/FieldSubDepartments'
import { ModalLabel } from '../../common/ModalSchema'
import FieldProductTeam from '../../common/form/FieldProductTeam'
import FieldDpProcessDepartment from './FieldDpProcessDepartment'

type TFieldDpProcessAffiliationProps = {
  formikBag: FormikProps<IDpProcessFormValues>
  codelistUtils: ICodelistProps
}

const FieldDpProcessAffiliation = (props: TFieldDpProcessAffiliationProps) => {
  const { formikBag, codelistUtils } = props

  return (
    <>
      <div className="flex w-full justify-between">
        <div className="w-[48%]">
          <ModalLabel
            label="Avdeling"
            tooltip="Angi hvilken avdeling som har hovedansvar for behandlingen."
          />
        </div>
        <div className="w-[48%]">
          <ModalLabel
            label="Linja"
            tooltip="Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres."
          />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="w-[48%]">
          <FieldDpProcessDepartment department={formikBag.values.affiliation.nomDepartmentId} />
        </div>
        <div className="w-[48%]">
          <FieldSubDepartments formikBag={formikBag} codelistUtils={codelistUtils} />
        </div>
      </div>

      <div className="flex w-full justify-between mt-2.5">
        <div className="w-[48%]">
          <ModalLabel
            label="Team (Oppslag i Teamkatalogen)"
            tooltip="Angi hvilke team som har forvaltningsansvaret for IT-systemene."
            fullwidth={true}
          />
        </div>
      </div>

      <div className="flex w-full justify-between">
        <div className="w-[48%]">
          <FieldProductTeam
            productTeams={formikBag.values.affiliation.productTeams}
            fieldName="affiliation.productTeams"
          />
        </div>
      </div>
    </>
  )
}

export default FieldDpProcessAffiliation
