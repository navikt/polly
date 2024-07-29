import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ProcessorFormValues } from '../../../constants'
import { codelist } from '../../../service/Codelist'
import { renderTagList } from '../../common/TagList'

interface IProps {
  formikBag: FormikProps<ProcessorFormValues>
}

const FieldCountries = (props: IProps) => {
  const { formikBag } = props
  const countries = formikBag.values.countries

  return (
    <FieldArray name="countries">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              clearable
              options={codelist
                .getCountryCodesOutsideEu()
                .map((code) => ({ id: code.code, label: code.description }))
                .filter((code) => !countries.includes(code.id))}
              onChange={({ value }) => {
                arrayHelpers.form.setFieldValue('countries', [...countries, ...value.map((value) => value.id)])
              }}
              maxDropdownHeight={'400px'}
            />
          </div>
          <div>
            <div>
              {renderTagList(
                countries.map((country) => codelist.countryName(country)),
                arrayHelpers,
              )}
            </div>
          </div>
        </div>
      )}
    </FieldArray>
  )
}

export default FieldCountries
