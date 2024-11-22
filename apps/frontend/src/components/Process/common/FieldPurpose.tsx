import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

const FieldPurpose = (props: { formikBag: FormikProps<IProcessFormValues> }) => {
  const { formikBag } = props
  const [codelistUtils] = CodelistService()
  const [selectedValue, setSelectedValue] = useState<string>(
    formikBag.values.purposes && formikBag.values.purposes.length > 0
      ? formikBag.values.purposes[0]
      : ''
  )

  return (
    <FieldArray
      name="purposes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <Select
            label="Velg overordnet behandlingsaktivitet"
            hideLabel
            value={selectedValue}
            onChange={(event) => {
              setSelectedValue(event.target.value)
              arrayHelpers.form.setFieldValue('purposes', [event.target.value])
            }}
          >
            <option value="">Velg overordnet behandlingsaktivitet</option>
            {codelistUtils.getParsedOptions(EListName.PURPOSE).map((codeList, index) => (
              <option key={index + '_' + codeList.id} value={codeList.id}>
                {codeList.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    />
  )
}

export default FieldPurpose
