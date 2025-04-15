import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'
import { CodelistService } from '../../../service/Codelist'
import { RenderTagList } from '../../common/RenderTagList'

interface IProps {
  formikBag: FormikProps<IProcessorFormValues>
}

const FieldCountries = (props: IProps) => {
  const { formikBag } = props
  const [codelistUtils] = CodelistService()

  const countries: string[] = formikBag.values.countries

  return (
    <FieldArray name="countries">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full mt-4">
          <Select
            id="countries"
            label="Land"
            description="I hvilke(t) land lagrer databehandleren personopplysninger i?"
            onChange={(event) => {
              arrayHelpers.form.setFieldValue('countries', [...countries, event.target.value])
            }}
          >
            <option value="">Velg land</option>
            {codelistUtils
              .getCountryCodesOutsideEu()
              .filter((land) => !countries.includes(land.code))
              .map((land) => (
                <option value={land.code} key={land.code}>
                  {land.description}
                </option>
              ))}
          </Select>
          <RenderTagList
            list={countries.map((country: string) => codelistUtils.countryName(country))}
            onRemove={arrayHelpers.remove}
          />
        </div>
      )}
    </FieldArray>
  )
}

export default FieldCountries
