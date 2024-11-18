import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

interface IFieldDepartmentProps {
  department?: string
  fieldName?: string
}

const FieldDepartment = (props: IFieldDepartmentProps) => {
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
      name={props.fieldName ? props.fieldName : 'affiliation.department'}
      render={({ form }: FieldProps<IProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelistUtils.getParsedOptions(EListName.DEPARTMENT)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue(
                props.fieldName ? props.fieldName : 'affiliation.department',
                value.length > 0 ? value[0].id : ''
              )
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
