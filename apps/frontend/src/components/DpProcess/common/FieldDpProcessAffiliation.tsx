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
      <div className="w-full">
        <ModalLabel
          label="Avdeling"
          tooltip="Angi hvilken avdeling som har hovedansvar for behandlingen."
        />
        <FieldDpProcessDepartment department={formikBag.values.affiliation.nomDepartmentId} />

        <div className="mt-3">
          <ModalLabel
            label="Linja"
            tooltip="Dersom behandlingen utføres i linja, angi hvor i linja behandlingen utføres."
          />
          <FieldSubDepartments formikBag={formikBag} codelistUtils={codelistUtils} />
        </div>
      </div>

      <div className="w-full mt-2.5">
        <ModalLabel
          label="Team (Oppslag i Teamkatalogen)"
          tooltip="Angi hvilke team som har forvaltningsansvaret for IT-systemene."
          fullwidth={true}
        />
      </div>

      <div className="w-full">
        <FieldProductTeam
          productTeams={formikBag.values.affiliation.productTeams}
          fieldName="affiliation.productTeams"
        />
      </div>
    </>
  )
}

export default FieldDpProcessAffiliation
