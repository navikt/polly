import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { IProcessorFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

const FieldTransferGroundsOutsideEU = () => {
  const [codelistUtils] = CodelistService()

  return (
    <Field name="transferGroundsOutsideEU">
      {({ form }: FieldProps<string, IProcessorFormValues>) => (
        <Select
          className="mt-4"
          value={form.values.transferGroundsOutsideEU}
          label="Overføringsgrunnlag for behandling utenfor EU/EØS"
          description="Velg grunnlag"
          onChange={(event) => {
            form.setFieldValue('transferGroundsOutsideEU', event.target.value)
          }}
          error={!!(form.errors.transferGroundsOutsideEU && form.submitCount)}
        >
          <option value="">Velg grunnlag</option>
          {codelistUtils.getParsedOptions(EListName.TRANSFER_GROUNDS_OUTSIDE_EU).map((grunnlag) => (
            <option value={grunnlag.id} key={grunnlag.id}>
              {grunnlag.label}
            </option>
          ))}
        </Select>
      )}
    </Field>
  )
}

export default FieldTransferGroundsOutsideEU
