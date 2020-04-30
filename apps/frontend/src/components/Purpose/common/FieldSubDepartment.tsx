import * as React from 'react'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'

const FieldSubDepartments = (props: { subDepartments: string[] }) => {
  const {subDepartments} = props
  const [value, setValue] = React.useState<Value>(subDepartments
    ? subDepartments.map(subDepartment => ({id: subDepartment, label: codelist.getShortname(ListName.SUB_DEPARTMENT, subDepartment)}))
    : [])

  return (
    <Field
      name='subDepartments'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            multi
            clearable
            options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('subDepartments', value.map(v => v.id))
            }}
            value={value}
          />
        </Block>
      )}
    />
  )

}

export default FieldSubDepartments
