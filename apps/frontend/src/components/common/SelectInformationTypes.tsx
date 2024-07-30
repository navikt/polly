import { Select, TYPE } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ChangeEvent } from 'react'
import { useInfoTypeSearch } from '../../api'
import { DisclosureFormValues } from '../../constants'
import { renderTagList } from './TagList'

type SelectInformationTypesProps = {
  formikBag: FormikProps<DisclosureFormValues>
}

const SelectInformationTypes = (props: SelectInformationTypesProps) => {
  const { formikBag } = props
  const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()

  return (
    <FieldArray
      name="informationTypes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              options={infoTypeSearchResult.filter((infoType) => !formikBag.values.informationTypes?.map((value) => value.id).includes(infoType.id))}
              clearable
              searchable={true}
              noResultsMsg="Ingen"
              type={TYPE.search}
              maxDropdownHeight="400px"
              placeholder="Søk opplysningersyper"
              onInputChange={(event: ChangeEvent<HTMLInputElement>) => setInfoTypeSearch(event.currentTarget.value)}
              labelKey="name"
              onChange={({ value }) =>
                arrayHelpers.form.setFieldValue(
                  'informationTypes',
                  formikBag.values.informationTypes ? [...formikBag.values.informationTypes, ...value.map((value) => value)] : value.map((value) => value),
                )
              }
            />
          </div>

          {formikBag.values.informationTypes && (
            <div>
              {renderTagList(
                formikBag.values.informationTypes.map((informationType) => informationType.name),
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
