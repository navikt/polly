import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { EListName, ICodelistProps } from '../../../service/Codelist'

interface IFieldDepartmentProps {
  codelistUtils: ICodelistProps
  department?: string
}

const FieldDepartment = (props: IFieldDepartmentProps) => {
  const { codelistUtils, department } = props

  const [value, setValue] = useState<string>(department ? department : '')

  return (
    <Field name="affiliation.department">
      {(fieldProps: FieldProps) => (
        <div className="w-full">
          <Select
            label="Velg avdeling"
            hideLabel
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              fieldProps.form.setFieldValue('affiliation.department', event.target.value)
            }}
          >
            <option value="">Velg avdeling</option>
            {codelistUtils.getParsedOptions(EListName.DEPARTMENT).map((department) => (
              <option key={department.id} value={department.id}>
                {department.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    </Field>
  )
}

export default FieldDepartment
