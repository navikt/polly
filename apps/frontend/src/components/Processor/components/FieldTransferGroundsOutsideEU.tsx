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
          id="transferGroundsOutsideEU"
          className="mt-4"
          value={form.values.transferGroundsOutsideEU}
          label="Velg Overføringsgrunnlag for behandling utenfor EU/EØS"
          onChange={(event) => {
            form.setFieldValue('transferGroundsOutsideEU', event.target.value)
          }}
        >
          <option value=""></option>
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
