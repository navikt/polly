import * as React from 'react'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'

const FieldCommonExternalProcessResponsible = (props: { thirdParty?: string }) => {
  const {thirdParty} = props
  const [value, setValue] = React.useState<Value>(thirdParty ? [{
    id: thirdParty,
    label: codelist.getShortname(ListName.THIRD_PARTY, thirdParty)
  }] : [])

  return (
    <Field
      name='commonExternalProcessResponsible'
      render={({form}: FieldProps<ProcessFormValues>) => (
        <Block marginRight='10px' width={'100%'}>
          <Select
            options={codelist.getParsedOptions(ListName.THIRD_PARTY)}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('commonExternalProcessResponsible', value.length > 0 ? value[0].id : '')
            }}
            value={value}
          />
        </Block>
      )}
    />
  )
}

export default FieldCommonExternalProcessResponsible
