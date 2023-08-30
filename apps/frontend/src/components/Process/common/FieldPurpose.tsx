import * as React from 'react'
import { Select } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'

const FieldPurpose = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="purposes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <Block width="100%">
          <Block width="100%">
            <Select
              value={codelist.getParsedOptionsForList(ListName.PURPOSE, formikBag.values.purposes)}
              options={codelist.getParsedOptions(ListName.PURPOSE).filter((o) => !formikBag.values.purposes.includes(o.id))}
              onChange={({ value }) => {
                arrayHelpers.form.setFieldValue(
                  'purposes',
                  value.map((v) => v.id),
                )
              }}
              overrides={{ Placeholder: { style: { color: 'black' } } }}
            />
          </Block>
        </Block>
      )}
    />
  )
}

export default FieldPurpose
