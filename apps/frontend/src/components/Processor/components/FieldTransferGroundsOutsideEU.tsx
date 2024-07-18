import * as React from 'react'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import { Field, FieldProps } from 'formik'
import { ProcessorFormValues } from '../../../constants'
import { Block } from 'baseui/block'

const FieldTransferGroundsOutsideEU = (props: { code?: string }) => {
  const { code } = props
  const [value, setValue] = React.useState<Value>(
    code
      ? [
          {
            id: code,
            label: codelist.getShortname(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, code),
          },
        ]
      : [],
  )

  return (
    <Field name="transferGroundsOutsideEU">
      {({ form }: FieldProps<string, ProcessorFormValues>) => (
        <div className="w-full">
          <Select
            options={codelist.getParsedOptions(ListName.TRANSFER_GROUNDS_OUTSIDE_EU)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('transferGroundsOutsideEU', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            error={!!(form.errors.transferGroundsOutsideEU && form.touched.transferGroundsOutsideEU)}
          />
        </div>
      )}
    </Field>
  )
}

export default FieldTransferGroundsOutsideEU
