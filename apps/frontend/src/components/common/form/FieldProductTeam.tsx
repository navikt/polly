import { Option, Value } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps } from 'formik'
import { useEffect, useState } from 'react'
import { getTeam, mapTeamToOption, useTeamSearchOptions } from '../../../api/GetAllApi'
import { ITeam } from '../../../constants'
import CustomSearchSelect from '../AsyncSelectComponents'
import { Error } from '../ModalSchema'
import { renderTagList } from '../TagList'

const FieldProductTeam = (props: { productTeams: string[]; fieldName: string }) => {
  const { productTeams, fieldName } = props
  const [values, setValues] = useState<Value>(
    productTeams.map((team) => ({ id: team, label: team }))
  )

  useEffect(() => {
    ;(async () => {
      const vals: Option[] = []
      const response: Promise<void>[] = productTeams.map((team: string, index: number) =>
        (async () => {
          try {
            vals.push(mapTeamToOption(await getTeam(team), index))
          } catch (error: any) {
            console.debug(error)
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
            <CustomSearchSelect
              ariaLabel="Søk etter team"
              placeholder=""
              loadOptions={useTeamSearchOptions}
              onChange={(value: ITeam) => {
                arrayHelpers.form.setFieldValue(fieldName, [...productTeams, value.id])
              }}
            />
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
