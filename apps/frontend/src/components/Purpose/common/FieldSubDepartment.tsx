import * as React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";

const FieldSubDepartment = (props: { subDepartment?: string }) => {
  const {subDepartment} = props
  const [value, setValue] = React.useState<Value>(subDepartment
    ? [{id: subDepartment, label: codelist.getShortname(ListName.SUB_DEPARTMENT, subDepartment)}]
    : [])

  return (
    <Field
      name='subDepartment'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('subDepartment', value.length > 0 ? value[0].id : '')
            }}
            value={value}
          />
        </Block>
      )}
    />
  )

}

export default FieldSubDepartment
