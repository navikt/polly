import * as React from "react";
import {useEffect} from "react";
import {Select, Value} from "baseui/select";
import {getTeam, mapTeamToOption, useTeamSearch} from "../../../api";
import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";

const FieldProductTeam = (props: { productTeam?: string }) => {
  const {productTeam} = props
  const [value, setValue] = React.useState<Value>(productTeam ? [{id: productTeam, label: productTeam}] : [])
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch()

  const initialValueTeam = async () => {
    if (!productTeam) return []
    return [mapTeamToOption(await getTeam(productTeam))]
  }
  useEffect(() => {
    (async () => setValue(await initialValueTeam()))()
  }, [productTeam])

  return (
    <Field
      name='productTeam'
      render={({form, field}: FieldProps<ProcessFormValues>) => (
        <Block width={'100%'}>
          <Select
            options={teamSearchResult}
            onChange={({value}) => {
              setValue(value)
              form.setFieldValue('productTeam', value && value.length > 0 ? value[0].id : '')
            }}
            onInputChange={event => setTeamSearch(event.currentTarget.value)}
            value={value}
            isLoading={teamSearchLoading}
          />
        </Block>
      )}
    />
  )
}

export default FieldProductTeam
