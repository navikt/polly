import { UNSAFE_Combobox } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { getResourceById, useTeamResourceSearch } from '../../../api/GetAllApi'
import { IProcessFormValues } from '../../../constants'

interface IProps {
  riskOwner?: string
}

const FieldRiskOwner = (props: IProps) => {
  const { riskOwner } = props
  const [selected, setSelected] = useState<{ label: string; value: string }[]>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] =
    useTeamResourceSearch()

  const comboboxOptions = useMemo(
    () =>
      (teamResourceSearchResult || []).map((option: any) => ({
        label: option.label,
        value: option.id,
      })),
    [teamResourceSearchResult]
  )

  useEffect(() => {
    ;(async () => {
      if (riskOwner) {
        setSelected([{ value: riskOwner, label: (await getResourceById(riskOwner)).fullName }])
      } else {
        setSelected([])
      }
    })()
  }, [riskOwner])

  return (
    <Field name="dpia.riskOwner">
      {({ form }: FieldProps<IProcessFormValues>) => (
        <div className="w-full">
          <UNSAFE_Combobox
            label="Risikoeier"
            hideLabel
            options={comboboxOptions}
            filteredOptions={comboboxOptions}
            isLoading={teamResourceSearchLoading}
            selectedOptions={selected || []}
            onChange={(value) => {
              setTeamResourceSearch(value)
            }}
            onToggleSelected={(optionValue, isSelected) => {
              if (!isSelected) {
                setSelected([])
                form.setFieldValue('dpia.riskOwner', '')
                return
              }

              const option = comboboxOptions.find((o) => o.value === optionValue)
              if (option) {
                setSelected([option])
                form.setFieldValue('dpia.riskOwner', option.value)
              }
            }}
          />
        </div>
      )}
    </Field>
  )
}
export default FieldRiskOwner
