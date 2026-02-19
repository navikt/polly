import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { searchInformationType } from '../../api/GetAllApi'
import { IDisclosureFormValues, IInformationTypeShort } from '../../constants'
import CustomSearchSelect from './AsyncSelectComponents'
import { renderTagList } from './TagList'

type TSelectInformationTypesProps = {
  formikBag: FormikProps<IDisclosureFormValues>
}

const SelectInformationTypes = (props: TSelectInformationTypesProps) => {
  const { formikBag } = props

  const useSearchOpplyningstyperOptions = async (searchParam: string) => {
    if (searchParam && searchParam.length > 2) {
      const opplysningstyper = (await searchInformationType(searchParam)).content

      const searchResult = opplysningstyper
        .filter(
          (infoType: IInformationTypeShort) =>
            !formikBag.values.informationTypes
              ?.map((value: IInformationTypeShort) => value.id)
              .includes(infoType.id)
        )
        .map((opplysningstype) => {
          return {
            ...opplysningstype,
            value: opplysningstype.id,
            label: opplysningstype.name,
          }
        })

      return searchResult
    }
    return []
  }

  return (
    <FieldArray
      name="informationTypes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <CustomSearchSelect
              ariaLabel="Søk opplysningersyper"
              placeholder=""
              loadOptions={useSearchOpplyningstyperOptions}
              onChange={(value) =>
                arrayHelpers.form.setFieldValue(
                  'informationTypes',
                  formikBag.values.informationTypes
                    ? [...formikBag.values.informationTypes, value]
                    : [value]
                )
              }
            />
          </div>

          {formikBag.values.informationTypes && (
            <div className="mt-2 flex flex-wrap gap-2">
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
