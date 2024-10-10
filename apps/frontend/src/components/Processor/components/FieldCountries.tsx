import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'
import { ICountryCode, codelist } from '../../../service/Codelist'
import { renderTagList } from '../../common/TagList'

interface IProps {
  formikBag: FormikProps<IProcessorFormValues>
}

const FieldCountries = (props: IProps) => {
  const { formikBag } = props
  const countries: string[] = formikBag.values.countries

  return (
    <FieldArray name="countries">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              clearable
              options={codelist
                .getCountryCodesOutsideEu()
                .map((code: ICountryCode) => ({ id: code.code, label: code.description }))
                .filter((code) => !countries.includes(code.id))}
              onChange={({ value }) => {
                arrayHelpers.form.setFieldValue('countries', [
                  ...countries,
                  ...value.map((value) => value.id),
                ])
              }}
              maxDropdownHeight={'400px'}
            />
          </div>
          <div>
            <div>
              {renderTagList(
                countries.map((country: string) => codelist.countryName(country)),
                arrayHelpers
              )}
            </div>
          </div>
        </div>
      )}
    </FieldArray>
  )
}

export default FieldCountries
