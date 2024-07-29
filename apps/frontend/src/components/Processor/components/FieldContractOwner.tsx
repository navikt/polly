import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { getResourceById, useTeamResourceSearch } from '../../../api'
import { ProcessorFormValues } from '../../../constants'

interface IProps {
  contractOwner?: string
}

const FieldContractOwner = (props: IProps) => {
  const { contractOwner } = props
  const [value, setValue] = useState<Value>()
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
