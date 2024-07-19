import * as React from 'react'
import { useEffect } from 'react'
import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { ProcessorFormValues } from '../../../constants'
import { Block } from 'baseui/block'
import { getResourceById, useTeamResourceSearch } from '../../../api'

const FieldContractOwner = (props: { contractOwner?: string }) => {
  const { contractOwner } = props
  const [value, setValue] = React.useState<Value>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()

  useEffect(() => {
    ;(async () => {
      if (contractOwner) {
        setValue([{ id: contractOwner, label: (await getResourceById(contractOwner)).fullName }])
      } else {
        setValue([])
      }
    })()
  }, [contractOwner])

  return (
    <Field name="contractOwner">
      {({ form, field }: FieldProps<ProcessorFormValues>) => (
        <div className="w-full">
          <Select
            options={teamResourceSearchResult}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('contractOwner', value && value.length > 0 ? value[0].id : '')
            }}
            onInputChange={(event) => setTeamResourceSearch(event.currentTarget.value)}
            value={value}
            isLoading={teamResourceSearchLoading}
          />
        </div>
      )}
    </Field>
  )
}
export default FieldContractOwner
