import { Select, TYPE } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ChangeEvent } from 'react'
import { useInfoTypeSearch } from '../../api'
import { IDisclosureFormValues, IInformationTypeShort } from '../../constants'
import { renderTagList } from './TagList'

type TSelectInformationTypesProps = {
  formikBag: FormikProps<IDisclosureFormValues>
}

const SelectInformationTypes = (props: TSelectInformationTypesProps) => {
  const { formikBag } = props
  const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()

  return (
    <FieldArray
      name="informationTypes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              options={infoTypeSearchResult.filter(
                (infoType: IInformationTypeShort) =>
                  !formikBag.values.informationTypes
                    ?.map((value: IInformationTypeShort) => value.id)
                    .includes(infoType.id)
              )}
              clearable
              searchable={true}
              noResultsMsg="Ingen"
              type={TYPE.search}
              maxDropdownHeight="400px"
              placeholder="Søk opplysningersyper"
              onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
                setInfoTypeSearch(event.currentTarget.value)
              }
              labelKey="name"
              onChange={({ value }) =>
                arrayHelpers.form.setFieldValue(
                  'informationTypes',
                  formikBag.values.informationTypes
                    ? [...formikBag.values.informationTypes, ...value.map((value) => value)]
                    : value.map((value) => value)
                )
              }
            />
          </div>

          {formikBag.values.informationTypes && (
            <div>
              {renderTagList(
                formikBag.values.informationTypes.map(
                  (informationType: IInformationTypeShort) => informationType.name
                ),
                arrayHelpers
              )}
            </div>
          )}
        </div>
      )}
    />
  )
}

export default SelectInformationTypes
