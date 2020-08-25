import * as React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";

const FieldPurpose = (props: { purposeCode?: string }) => {
  const {purposeCode} = props
  const [value, setValue] = React.useState<Value>(purposeCode ? [{
    id: purposeCode,
    label: codelist.getShortname(ListName.PURPOSE, purposeCode)
  }] : [])

  return (
    <Field
      name='purposeCode'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.PURPOSE)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('purposeCode', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            error={!!(form.errors.purposeCode && form.touched.purposeCode)}
          />
        </Block>
      )}
    />
  )
}

export default FieldPurpose
