import { Select } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { getAvdelingOptions } from '../../../api/NomApi'
import { TOption } from '../../../constants'

interface IFieldDepartmentProps {
  department?: string
}

const FieldDepartment = (props: IFieldDepartmentProps) => {
  const { department } = props
  const [alleAvdelingOptions, setAlleAvdelingOptions] = useState<TOption[]>([])
  const [value, setValue] = useState<string>(department ? department : '')

  useEffect(() => {
    ;(async () => {
      await getAvdelingOptions().then(setAlleAvdelingOptions)
    })()
  }, [])

  return (
    <Field name="affiliation.nomDepartmentId">
      {(fieldProps: FieldProps) => (
        <div className="w-full">
          <Select
            label="Velg avdeling"
            hideLabel
            value={value}
            onChange={async (event) => {
              setValue(event.target.value)
              await fieldProps.form.setFieldValue('affiliation.nomDepartmentId', event.target.value)
              await fieldProps.form.setFieldValue(
                'affiliation.nomDepartmentName',
                alleAvdelingOptions.filter((avdeling) => avdeling.value === event.target.value)[0]
                  .label
              )
            }}
          >
            <option value="">Velg avdeling</option>
            {alleAvdelingOptions.map((department) => (
              <option key={department.value} value={department.value}>
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
