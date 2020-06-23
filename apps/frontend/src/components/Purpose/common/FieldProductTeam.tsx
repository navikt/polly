import * as React from 'react'
import {useEffect} from 'react'
import {Option, Select, Value} from 'baseui/select'
import {getTeam, mapTeamToOption, useTeamSearch} from '../../../api'
import {FieldArray, FormikProps} from 'formik'
import {Block} from 'baseui/block'
import {renderTagList} from '../../common/TagList'
import {ProcessFormValues} from '../../../constants'


const FieldProductTeam = (props: {formikBag: FormikProps<ProcessFormValues>}) => {
  const productTeams = props.formikBag.values.productTeams
  const [values, setValues] = React.useState<Value>(productTeams.map(t => ({id: t, label: t})))
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch()

  useEffect(() => {
    (async () => {
      const vals: Option[] = []
      const fs = productTeams.map((id, idx) => (async () => {
        try {
          vals.push(mapTeamToOption(await getTeam(id), idx))
        } catch (e) {
          vals.push({id, label: 'na: ' + id, idx})
        }
      })())
      await Promise.all(fs)
      setValues(vals.sort(v => v.idx))
    })()
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
