import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useContext } from 'react'
import { CodelistContext } from '@/provider/kodeverkProvider'
import { IDatabehandlerFormValues } from '../../../constants'
import { RenderTagList } from '../../common/RenderTagList'

interface IProps {
  formikBag: FormikProps<IDatabehandlerFormValues>
}

const FieldLandDataOverforesTil = (props: IProps) => {
  const { formikBag } = props
  const { utils: codelistUtils } = useContext(CodelistContext)

  const countries: string[] = formikBag.values.landDataOverforesTil

  return (
    <FieldArray name='landDataOverforesTil'>
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className='w-full mt-4'>
          <Select
            id='landDataOverforesTil'
            label='I hvilke(t) land lagrer databehandleren personopplysninger i?'
            onChange={(event) => {
              arrayHelpers.form.setFieldValue('landDataOverforesTil', [
                ...countries,
                event.target.value,
              ])
            }}
          >
            <option value=''></option>
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

export default FieldLandDataOverforesTil
