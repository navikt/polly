import * as React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {Field, FieldProps} from "formik";
import {DpProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";

const FieldDpProcessTransferGroundsOutsideEU = (props: {code?: string}) => {
  const {code} = props
  const [value, setValue] = React.useState<Value>(code ? [{
    id: code,
    label: codelist.getShortname(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, code)
  }] : [])

  return (
    <Field
      name='subDataProcessing.transferGroundsOutsideEU'
      render={({form}: FieldProps<string, DpProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.TRANSFER_GROUNDS_OUTSIDE_EU)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('subDataProcessing.transferGroundsOutsideEU', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            error={!!(form.errors.subDataProcessing?.transferGroundsOutsideEU && form.touched.subDataProcessing?.transferGroundsOutsideEU)}
          />
        </Block>
      )}
    />
  )
}

export default FieldDpProcessTransferGroundsOutsideEU
