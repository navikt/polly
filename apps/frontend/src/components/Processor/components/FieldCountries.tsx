import * as React from 'react'
import { Select } from 'baseui/select'
import { codelist } from '../../../service/Codelist'
import { FieldArray, FormikProps } from 'formik'
import { ProcessorFormValues } from '../../../constants'
import { Block } from 'baseui/block'
import { renderTagList } from '../../common/TagList'

const FieldCountries = (props: { formikBag: FormikProps<ProcessorFormValues> }) => {
  const countries = props.formikBag.values.countries

  return (
    <FieldArray name="countries">
      {(arrayHelpers) => (
        <Block width="100%">
          <Block width="100%">
            <Select
              clearable
              options={codelist
                .getCountryCodesOutsideEu()
                .map((c) => ({ id: c.code, label: c.description }))
                .filter((o) => !countries.includes(o.id))}
              onChange={({ value }) => {
                arrayHelpers.form.setFieldValue('countries', [...countries, ...value.map((v) => v.id)])
              }}
              maxDropdownHeight={'400px'}
            />
          </Block>
          <Block>
            <Block>
              {renderTagList(
                countries.map((c) => codelist.countryName(c)),
                arrayHelpers,
              )}
            </Block>
          </Block>
        </Block>
      )}
    </FieldArray>
  )
}

export default FieldCountries
