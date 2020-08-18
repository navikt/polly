import * as React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";

const FieldDepartment = (props: { department?: string }) => {
  const {department} = props
  const [value, setValue] = React.useState<Value>(department ? [{
    id: department,
    label: codelist.getShortname(ListName.DEPARTMENT, department)
  }] : [])

  return (
    <Field
      name='department'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.DEPARTMENT)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('department', value.length > 0 ? value[0].id : '')
            }}
            value={value}
          />
        </Block>
      )}
    />
  )
}

export default FieldDepartment
