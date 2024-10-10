import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'

interface IFieldCommonExternalProcessResponsibleProps {
  thirdParty?: string
  hideSelect: () => void
}

const FieldCommonExternalProcessResponsible = (
  props: IFieldCommonExternalProcessResponsibleProps
) => {
  const { thirdParty, hideSelect } = props
  const [value, setValue] = useState<Value>(
    thirdParty
      ? [
          {
            id: thirdParty,
            label: codelist.getShortname(EListName.THIRD_PARTY, thirdParty),
          },
        ]
      : []
  )

  return (
    <Field
      name="commonExternalProcessResponsible"
      render={({ form }: FieldProps<IProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelist.getParsedOptions(EListName.THIRD_PARTY)}
            onChange={({ value }) => {
              if (!value.length) hideSelect()
              setValue(value)
              form.setFieldValue(
                'commonExternalProcessResponsible',
                value.length > 0 ? value[0].id : ''
              )
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
