import * as React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";

const FieldTransferGroundsOutsideEU = (props: {code?: string}) => {
  const {code} = props
  const [value, setValue] = React.useState<Value>(code ? [{
    id: code,
    label: codelist.getShortname(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, code)
  }] : [])

  return (
    <Field
      name='dataProcessing.transferGroundsOutsideEU'
      render={({form}: FieldProps<string, ProcessFormValues>) => (
        <Block marginRight='10px' width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.TRANSFER_GROUNDS_OUTSIDE_EU)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('dataProcessing.transferGroundsOutsideEU', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            error={!!(form.errors.dataProcessing?.transferGroundsOutsideEU && form.touched.dataProcessing?.transferGroundsOutsideEU)}
          />
        </Block>
      )}
    />
  )
}

export default FieldTransferGroundsOutsideEU
