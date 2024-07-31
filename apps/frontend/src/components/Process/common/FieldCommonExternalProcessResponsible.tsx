import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { ProcessFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'

interface IFieldCommonExternalProcessResponsibleProps {
  thirdParty?: string
  hideSelect: () => void
}

const FieldCommonExternalProcessResponsible = (props: IFieldCommonExternalProcessResponsibleProps) => {
  const { thirdParty, hideSelect } = props
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
      name="commonExternalProcessResponsible"
      render={({ form }: FieldProps<ProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
            onChange={({ value }) => {
              if (!value.length) hideSelect()
              setValue(value)
              form.setFieldValue('commonExternalProcessResponsible', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            overrides={{ Placeholder: { style: { color: 'black' } } }}
          />
        </div>
      )}
    />
  )
}

export default FieldCommonExternalProcessResponsible
