import { Select } from '@navikt/ds-react'
import { LabelMedium } from 'baseui/typography'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { EProcessStatusFilter } from '../../constants'
import { theme } from '../../util'
import { useState } from 'react'

interface IFilterDashboardStatusProps {
  setFilter: React.Dispatch<React.SetStateAction<EProcessStatusFilter>>
}

export const FilterDashboardStatus = (props: IFilterDashboardStatusProps) => {
  const { setFilter } = props
  const navigate: NavigateFunction = useNavigate()
  const { processStatus } = useParams<{ processStatus: EProcessStatusFilter }>()
  const [selectValue, setSelectValue] = useState<string>(processStatus ? (processStatus as EProcessStatusFilter) : EProcessStatusFilter.All)

  return (
    <div className="w-full flex flex-row-reverse mt-4">
      <div className="w-60">
        <Select
          value={selectValue}
          label="Filtrer diagrammene på status"
          hideLabel
          onChange={(event) => {
            navigate(`/dashboard/${event.target.value}`)
            setFilter(event.target.value as EProcessStatusFilter)
            setSelectValue(event.target.value)
          }}
        >
          <option value={EProcessStatusFilter.All}>Alle</option>
          <option value={EProcessStatusFilter.IN_PROGRESS}>Under arbeid</option>
          <option value={EProcessStatusFilter.NEEDS_REVISION}>Trenger revidering</option>
          <option value={EProcessStatusFilter.COMPLETED}>Fullført</option>
        </Select>
      </div>
      <div className="self-center">
        <LabelMedium color={theme.colors.primary} marginRight={'1rem'}>
          Filtrer diagrammene på status
        </LabelMedium>
      </div>
    </div>
  )
}
