import * as React from 'react'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import { Field, FieldProps } from 'formik'
import { DpProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'

const FieldDpProcessDepartment = (props: { department?: string }) => {
  const { department } = props
  const [value, setValue] = React.useState<Value>(
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
