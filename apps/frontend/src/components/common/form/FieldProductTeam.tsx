import * as React from 'react'
import {useEffect} from 'react'
import {Option, Select, Value} from 'baseui/select'
import {getTeam, mapTeamToOption, useTeamSearch} from '../../../api'
import {FieldArray} from 'formik'
import {Block} from 'baseui/block'
import {renderTagList} from '../TagList'
import {Error} from '../ModalSchema'


const FieldProductTeam = (props: {productTeams: string[], fieldName: string}) => {
  const {productTeams, fieldName} = props
  const [values, setValues] = React.useState<Value>(productTeams.map(t => ({id: t, label: t})))
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch()

  useEffect(() => {
    (async () => {
      const vals: Option[] = []
      const fs = productTeams.map((id, idx) => (async () => {
        try {
          vals.push(mapTeamToOption(await getTeam(id), idx))
        } catch (e:any) {
          vals.push({id, label: 'na: ' + id, idx})
        }
      })())
      await Promise.all(fs)
      setValues(vals.sort(v => v.idx))
    })()
  }, [productTeams])

  return (
    <>
      <FieldArray
        name={fieldName}
        render={arrayHelpers => (
          <Block width={'100%'}>
            <Block width={'100%'}>
              <Select
                clearable
                options={teamSearchResult}
                onChange={({value}) => {
                  arrayHelpers.form.setFieldValue(fieldName, [...productTeams, ...value.map(v => v.id)])
                }}
                onInputChange={event => setTeamSearch(event.currentTarget.value)}
                isLoading={teamSearchLoading}
                overrides={{Placeholder: {style: {color: 'black'}}}}
              />
            </Block>
            <Block>
              <Block>{renderTagList(values.map(v => v.label) as string[], arrayHelpers)}</Block>
            </Block>
          </Block>
        )}
      />
      <Error fieldName={fieldName} fullWidth/>
    </>
  )
}

export default FieldProductTeam
