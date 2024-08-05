import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { DpProcessFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'

interface IFieldDpProcessDepartment {
  department?: string
}

const FieldDpProcessDepartment = (props: IFieldDpProcessDepartment) => {
  const { department } = props
  const [value, setValue] = useState<Value>(
    department
      ? [
          {
            id: department,
            label: codelist.getShortname(ListName.DEPARTMENT, department),
          },
        ]
      : [],
  )

  return (
    <Field
      name="affiliation.department"
      render={({ form }: FieldProps<DpProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelist.getParsedOptions(ListName.DEPARTMENT)}
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
