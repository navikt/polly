import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { EListName, codelist } from '../../service/Codelist'
import { renderTagList } from './TagList'

interface IFieldSubDepartmentsProps {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
}

const FieldSubDepartments = (props: IFieldSubDepartmentsProps) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="affiliation.subDepartments"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              label=""
              hideLabel
              onChange={(event) => {
                if (event.target.value) {
                  arrayHelpers.form.setFieldValue('affiliation.subDepartments', [
                    ...formikBag.values.affiliation.subDepartments,
                    event.target.value,
                  ])
                }
              }}
            >
              <option value="">Velg linje</option>
              {codelist
                .getParsedOptions(EListName.SUB_DEPARTMENT)
                .filter((code) => !formikBag.values.affiliation.subDepartments.includes(code.id))
                .map((code) => (
                  <option key={code.id} value={code.id}>
                    {code.label}
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <div>
              {renderTagList(
                formikBag.values.affiliation.subDepartments.map((subDepartment: string) =>
                  codelist.getShortname(EListName.SUB_DEPARTMENT, subDepartment)
                ),
                arrayHelpers
              )}
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default FieldSubDepartments
