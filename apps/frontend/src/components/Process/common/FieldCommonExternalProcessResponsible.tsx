import * as React from 'react'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'

const FieldCommonExternalProcessResponsible = (props: { thirdParty?: string; hideSelect: () => void }) => {
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
      name="commonExternalProcessResponsible"
      render={({ form }: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
            onChange={({ value }) => {
              if (!value.length) props.hideSelect()
              setValue(value)
              form.setFieldValue('commonExternalProcessResponsible', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            overrides={{ Placeholder: { style: { color: 'black' } } }}
          />
        </Block>
      )}
    />
  )
}

export default FieldCommonExternalProcessResponsible
