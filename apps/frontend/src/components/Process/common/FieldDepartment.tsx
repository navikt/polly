import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { ProcessFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'

const FieldDepartment = (props: { department?: string; fieldName?: string }) => {
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
      name={props.fieldName ? props.fieldName : 'affiliation.department'}
      render={({ form }: FieldProps<ProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelist.getParsedOptions(ListName.DEPARTMENT)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue(props.fieldName ? props.fieldName : 'affiliation.department', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            overrides={{ Placeholder: { style: { color: 'black' } } }}
          />
        </div>
      )}
    />
  )
}

export default FieldDepartment
