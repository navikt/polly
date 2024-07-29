import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import * as React from 'react'
import { DpProcessFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'

const FieldDpProcessExternalProcessResponsible = (props: { thirdParty?: string }) => {
  const { thirdParty } = props
  const [value, setValue] = React.useState<Value>(
    thirdParty
      ? [
          {
            id: thirdParty,
            label: codelist.getShortname(ListName.THIRD_PARTY, thirdParty),
          },
        ]
      : [],
  )

  return (
    <Field
      name="externalProcessResponsible"
      render={({ form }: FieldProps<DpProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('externalProcessResponsible', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            placeholder=""
          />
        </div>
      )}
    />
  )
}

export default FieldDpProcessExternalProcessResponsible
