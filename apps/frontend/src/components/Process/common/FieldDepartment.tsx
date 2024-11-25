import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { EListName, ICodelistProps } from '../../../service/Codelist'

interface IFieldDepartmentProps {
  codelistUtils: ICodelistProps
  department?: string
  fieldName?: string
}

const FieldDepartment = (props: IFieldDepartmentProps) => {
  const { codelistUtils, department } = props

  const [value, setValue] = useState<string>(department ? department : '')

  return (
    <Field
      name={props.fieldName ? props.fieldName : 'affiliation.department'}
      render={({ form }: FieldProps<IProcessFormValues>) => (
        <div className="w-full">
          <Select
            label="Velg avdeling"
            hideLabel
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              form.setFieldValue(
                props.fieldName ? props.fieldName : 'affiliation.department',
                value
              )
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
    />
  )
}

export default FieldDepartment
