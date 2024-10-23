import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IProcessorFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

interface IProps {
  code?: string
}

const FieldTransferGroundsOutsideEU = (props: IProps) => {
  const { code } = props
  const [codelistUtils] = CodelistService()

  const [value, setValue] = useState<Value>(
    code
      ? [
          {
            id: code,
            label: codelistUtils.getShortname(EListName.TRANSFER_GROUNDS_OUTSIDE_EU, code),
          },
        ]
      : []
  )

  return (
    <Field name="transferGroundsOutsideEU">
      {({ form }: FieldProps<string, IProcessorFormValues>) => (
        <div className="w-full">
          <Select
            options={codelistUtils.getParsedOptions(EListName.TRANSFER_GROUNDS_OUTSIDE_EU)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('transferGroundsOutsideEU', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            error={
              !!(form.errors.transferGroundsOutsideEU && form.touched.transferGroundsOutsideEU)
            }
          />
        </div>
      )}
    </Field>
  )
}

export default FieldTransferGroundsOutsideEU
