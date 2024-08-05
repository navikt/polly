import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { DpProcessFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'

interface IFieldDpProcessExternalProcessResponsible {
  thirdParty?: string
}

const FieldDpProcessExternalProcessResponsible = (props: IFieldDpProcessExternalProcessResponsible) => {
  const { thirdParty } = props
  const [value, setValue] = useState<Value>(
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
