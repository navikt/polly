import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

interface IFieldDpProcessExternalProcessResponsible {
  thirdParty?: string
}

const FieldDpProcessExternalProcessResponsible = (
  props: IFieldDpProcessExternalProcessResponsible
) => {
  const { thirdParty } = props
  const [codelistUtils] = CodelistService()
  const [value, setValue] = useState<string>(thirdParty ? thirdParty : '')

  return (
    <Field name="externalProcessResponsible">
      {({ form }: FieldProps<IDpProcessFormValues>) => (
        <div className="w-full">
          <Select
            label=""
            hideLabel
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              form.setFieldValue('externalProcessResponsible', event.target.value)
            }}
          >
            <option value="">Velg behandlingsansvarlig</option>
            {codelistUtils.getParsedOptions(EListName.THIRD_PARTY).map((code) => (
              <option key={code.id} value={code.id}>
                {code.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    </Field>
  )
}

export default FieldDpProcessExternalProcessResponsible
