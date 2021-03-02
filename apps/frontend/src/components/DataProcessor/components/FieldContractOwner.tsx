import * as React from 'react'
import {useEffect} from 'react'
import {Select, Value} from 'baseui/select'
import {Field, FieldProps} from 'formik'
import {DataProcessorFormValues} from '../../../constants'
import {Block} from 'baseui/block'
import {getResourceById, useTeamResourceSearch} from '../../../api'

const FieldContractOwner = (props: { contractOwner?: string }) => {
  const {contractOwner} = props
  const [value, setValue] = React.useState<Value>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()

  useEffect(() => {
    (async () => {
      if (contractOwner) {
        setValue([{id: contractOwner, label: (await getResourceById(contractOwner)).fullName}])
      } else {
        setValue([])
      }
    })()
  }, [contractOwner])

  return (
    <Field
      name="contractOwner"
      render={({form, field}: FieldProps<DataProcessorFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={teamResourceSearchResult}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('contractOwner', value && value.length > 0 ? value[0].id : '')
            }}
            onInputChange={event => setTeamResourceSearch(event.currentTarget.value)}
            value={value}
            isLoading={teamResourceSearchLoading}
          />
        </Block>
      )}
    />
  )
}
export default FieldContractOwner
