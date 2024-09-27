import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'
import { getResourceById, useTeamResourceSearch } from '../../../api'
import { IProcessFormValues } from '../../../constants'

interface IProps {
  riskOwner?: string
}

const FieldRiskOwner = (props: IProps) => {
  const { riskOwner } = props
  const [value, setValue] = useState<Value>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] =
    useTeamResourceSearch()

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
      render={({ form }: FieldProps<IProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={teamResourceSearchResult}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('dpia.riskOwner', value && value.length > 0 ? value[0].id : '')
            }}
            onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
              setTeamResourceSearch(event.currentTarget.value)
            }
            value={value}
            isLoading={teamResourceSearchLoading}
          />
        </div>
      )}
    />
  )
}
export default FieldRiskOwner
