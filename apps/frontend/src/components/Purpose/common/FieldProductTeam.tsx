import * as React from 'react'
import { useEffect } from 'react'
import { Select, Value } from 'baseui/select'
import { getTeam, mapTeamToOption, useTeamSearch } from '../../../api'
import { FieldArray } from 'formik'
import { Block } from 'baseui/block'
import { renderTagList } from '../../common/TagList'

const initialValueTeam = async (productTeams: string[]) => {
  if (!productTeams.length) return []
  return (await Promise.all(productTeams.map(t => getTeam(t)))).map(mapTeamToOption)
}

const FieldProductTeam = (props: { productTeams: string[] }) => {
  const {productTeams} = props
  const [values, setValues] = React.useState<Value>(productTeams.map(t => ({id: t, label: t})))
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch()


  useEffect(() => {
    (async () => setValues(await initialValueTeam(productTeams)))()
  }, [productTeams])

  return (
    <FieldArray
      name='productTeams'
      render={arrayHelpers => (
        <Block width={'100%'}>
          <Block width={'100%'}>
            <Select
              clearable
              options={teamSearchResult}
              onChange={({value}) => {
                setValues(value)
                arrayHelpers.form.setFieldValue('productTeams', [...productTeams, ...value.map(v => v.id)])
              }}
              onInputChange={event => setTeamSearch(event.currentTarget.value)}
              isLoading={teamSearchLoading}
            />
          </Block>
          <Block>
            <Block>{renderTagList(values.map(v => v.label) as string[], arrayHelpers)}</Block>
          </Block>
        </Block>
      )}
    />
  )
}

export default FieldProductTeam
