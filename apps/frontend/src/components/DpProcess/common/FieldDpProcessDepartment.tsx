import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

interface IFieldDpProcessDepartment {
  department?: string
}

const FieldDpProcessDepartment = (props: IFieldDpProcessDepartment) => {
  const { department } = props
  const [codelistUtils] = CodelistService()

  const [value, setValue] = useState<Value>(
    department
      ? [
          {
            id: department,
            label: codelistUtils.getShortname(EListName.DEPARTMENT, department),
          },
        ]
      : []
  )

  return (
    <Field
      name="affiliation.department"
      render={({ form }: FieldProps<IDpProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelistUtils.getParsedOptions(EListName.DEPARTMENT)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('affiliation.department', value.length > 0 ? value[0].id : '')
            }}
            value={value}
          />
        </div>
      )}
    />
  )
}

export default FieldDpProcessDepartment
