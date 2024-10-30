import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { EListName, ICodelistProps, IGetParsedOptionsProps } from '../../service/Codelist'
import { renderTagList } from './TagList'

interface IFieldSubDepartmentsProps {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
  codelistUtils: ICodelistProps
}

const FieldSubDepartments = (props: IFieldSubDepartmentsProps) => {
  const { formikBag, codelistUtils } = props

  return (
    <FieldArray
      name="affiliation.subDepartments"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              clearable
              options={codelistUtils
                .getParsedOptions(EListName.SUB_DEPARTMENT)
                .filter(
                  (code: IGetParsedOptionsProps) =>
                    !formikBag.values.affiliation.subDepartments.includes(code.id)
                )}
              onChange={({ value }) => {
                arrayHelpers.form.setFieldValue('affiliation.subDepartments', [
                  ...formikBag.values.affiliation.subDepartments,
                  ...value.map((value) => value.id),
                ])
              }}
              overrides={{ Placeholder: { style: { color: 'black' } } }}
            />
          </div>
          <div>
            <div>
              {renderTagList(
                formikBag.values.affiliation.subDepartments.map((subDepartment: string) =>
                  codelistUtils.getShortname(EListName.SUB_DEPARTMENT, subDepartment)
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
