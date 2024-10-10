import { Option, Select, Value } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'
import { getTeam, mapTeamToOption, useTeamSearch } from '../../../api'
import { Error } from '../ModalSchema'
import { renderTagList } from '../TagList'

const FieldProductTeam = (props: { productTeams: string[]; fieldName: string }) => {
  const { productTeams, fieldName } = props
  const [values, setValues] = useState<Value>(
    productTeams.map((team) => ({ id: team, label: team }))
  )
  const [teamSearchResult, setTeamSearch, teamSearchLoading] = useTeamSearch()

  useEffect(() => {
    ;(async () => {
      const vals: Option[] = []
      const response: Promise<void>[] = productTeams.map((team: string, index: number) =>
        (async () => {
          try {
            vals.push(mapTeamToOption(await getTeam(team), index))
          } catch (error: any) {
            vals.push({ team, label: 'na: ' + team, index })
          }
        })()
      )
      await Promise.all(response)
      setValues(vals.sort((value) => value.idx))
    })()
  }, [productTeams])

  return (
    <>
      <FieldArray
        name={fieldName}
        render={(arrayHelpers: FieldArrayRenderProps) => (
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={teamSearchResult}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue(fieldName, [
                    ...productTeams,
                    ...value.map((value) => value.id),
                  ])
                }}
                onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setTeamSearch(event.currentTarget.value)
                }
                isLoading={teamSearchLoading}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              <div>
                {renderTagList(values.map((value) => value.label) as string[], arrayHelpers)}
              </div>
            </div>
          </div>
        )}
      />
      <Error fieldName={fieldName} fullWidth />
    </>
  )
}

export default FieldProductTeam
