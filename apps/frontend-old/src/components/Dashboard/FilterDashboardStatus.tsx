import { Label, Select } from '@navikt/ds-react'
import { useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router'
import { EProcessStatusFilter } from '../../constants'

interface IFilterDashboardStatusProps {
  setFilter: React.Dispatch<React.SetStateAction<EProcessStatusFilter>>
}

export const FilterDashboardStatus = (props: IFilterDashboardStatusProps) => {
  const { setFilter } = props
  const navigate: NavigateFunction = useNavigate()
  const { processStatus } = useParams<{ processStatus: EProcessStatusFilter }>()
  const [selectValue, setSelectValue] = useState<string>(
    processStatus ? (processStatus as EProcessStatusFilter) : EProcessStatusFilter.All
  )

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
        <Label className="mr-4">Filtrer diagrammene på status</Label>
      </div>
    </div>
  )
}
