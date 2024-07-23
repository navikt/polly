import * as React from 'react'
import { useEffect } from 'react'
import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'
import { getResourceById, useTeamResourceSearch } from '../../../api'

const FieldRiskOwner = (props: { riskOwner?: string }) => {
  const { riskOwner } = props
  const [value, setValue] = React.useState<Value>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()

  useEffect(() => {
    ;(async () => {
      if (riskOwner) {
        setValue([{ id: riskOwner, label: (await getResourceById(riskOwner)).fullName }])
      } else {
        setValue([])
      }
    })()
  }, [riskOwner])

  return (
    <Field
      name="dpia.riskOwner"
      render={({ form, field }: FieldProps<ProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={teamResourceSearchResult}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('dpia.riskOwner', value && value.length > 0 ? value[0].id : '')
            }}
            onInputChange={(event) => setTeamResourceSearch(event.currentTarget.value)}
            value={value}
            isLoading={teamResourceSearchLoading}
          />
        </div>
      )}
    />
  )
}
export default FieldRiskOwner
