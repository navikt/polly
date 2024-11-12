import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'

interface IFieldDpProcessDepartment {
  department?: string
}

const FieldDpProcessDepartment = (props: IFieldDpProcessDepartment) => {
  const { department } = props
  const [value, setValue] = useState<string>(department ? department : '')
  return (
    <Field
      name="affiliation.department"
      render={({ form }: FieldProps<IDpProcessFormValues>) => (
        <div className="w-full">
          <Select
            label=""
            hideLabel
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              form.setFieldValue('affiliation.department', event.target.value)
            }}
          >
            <option value="">Velg avdeling</option>
            {codelist.getParsedOptions(EListName.DEPARTMENT).map((department) => (
              <option key={department.id} value={department.id}>
                {department.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    />
  )
}

export default FieldDpProcessDepartment
