import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { ProcessorFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'

interface IProps {
  code?: string
}

const FieldTransferGroundsOutsideEU = (props: IProps) => {
  const { code } = props
  const [value, setValue] = useState<Value>(
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
