import { Block } from 'baseui/block'
import { Select, TYPE } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import * as React from 'react'
import { useInfoTypeSearch } from '../../api'
import { DisclosureFormValues } from '../../constants'
import { renderTagList } from './TagList'

type SelectInformationTypesProps = {
  formikBag: FormikProps<DisclosureFormValues>
}

const SelectInformationTypes = (props: SelectInformationTypesProps) => {
  const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()
  const { formikBag } = props

  return (
    <FieldArray
      name="informationTypes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              options={infoTypeSearchResult.filter((i) => !formikBag.values.informationTypes?.map((value) => value.id).includes(i.id))}
              clearable
              searchable={true}
              noResultsMsg='Ingen'
              type={TYPE.search}
              maxDropdownHeight="400px"
              placeholder='Søk opplysningersyper'
              onInputChange={(event) => setInfoTypeSearch(event.currentTarget.value)}
              labelKey="name"
              onChange={({ value }) =>
                arrayHelpers.form.setFieldValue(
                  'informationTypes',
                  formikBag.values.informationTypes ? [...formikBag.values.informationTypes, ...value.map((v) => v)] : value.map((v) => v),
                )
              }
            />
          </div>

          {formikBag.values.informationTypes && (
            <div>
              {renderTagList(
                formikBag.values.informationTypes.map((i) => i.name),
                arrayHelpers,
              )}
            </div>
          )}
        </div>
      )}
    />
  )
}

export default SelectInformationTypes
