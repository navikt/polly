import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useContext } from 'react'
import { EListName, IGetParsedOptionsProps } from '@/constants/codelistConstant'
import { CodelistContext } from '@/provider/kodeverkProvider'
import { IDatabehandlerFormValues } from '../../../constants'

const FieldOverforingsgrunnlagUtenforEuEos = () => {
  const { utils: codelistUtils } = useContext(CodelistContext)

  return (
    <Field name='overforingsgrunnlagUtenforEuEos'>
      {({ form }: FieldProps<string, IDatabehandlerFormValues>) => (
        <Select
          id='overforingsgrunnlagUtenforEuEos'
          className='mt-4'
          value={form.values.overforingsgrunnlagUtenforEuEos}
          label='Velg Overføringsgrunnlag for behandling utenfor EU/EØS'
          onChange={(event) => {
            form.setFieldValue('overforingsgrunnlagUtenforEuEos', event.target.value)
          }}
        >
          <option value=''></option>
          {codelistUtils
            .getParsedOptions(EListName.TRANSFER_GROUNDS_OUTSIDE_EU) // TODO: overforingsgrunnlagUtenforEuEos
            .map((grunnlag: IGetParsedOptionsProps) => (
              <option value={grunnlag.id} key={grunnlag.id}>
                {grunnlag.label}
              </option>
            ))}
        </Select>
      )}
    </Field>
  )
}

export default FieldOverforingsgrunnlagUtenforEuEos
