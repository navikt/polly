import { StatefulSelect } from 'baseui/select'
import { LabelMedium } from 'baseui/typography'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { ProcessStatusFilter } from '../../constants'
import { theme } from '../../util'

interface IFilterDashboardStatusProps {
  setFilter: Function
}

export const FilterDashboardStatus = (props: IFilterDashboardStatusProps) => {
  const { setFilter } = props
  const navigate: NavigateFunction = useNavigate()
  const { processStatus } = useParams<{ processStatus: ProcessStatusFilter }>()

  return (
    <div className="w-full flex flex-row-reverse mt-4">
      <div className="w-60">
        <StatefulSelect
          backspaceRemoves={false}
          clearable={false}
          deleteRemoves={false}
          escapeClearsValue={false}
          options={[
            { label: 'Alle', id: ProcessStatusFilter.All },
            { label: 'Under arbeid', id: ProcessStatusFilter.IN_PROGRESS },
            { label: 'Trenger revidering', id: ProcessStatusFilter.NEEDS_REVISION },
            { label: 'Fullført', id: ProcessStatusFilter.COMPLETED },
          ]}
          initialState={{ value: [{ id: processStatus ? (processStatus as ProcessStatusFilter) : ProcessStatusFilter.All }] }}
          filterOutSelected={false}
          searchable={false}
          onChange={(params: any) => {
            navigate(`/dashboard/${params.value[0].id}`)
            setFilter(params.value[0].id)
          }}
        />
      </div>
      <div className="self-center">
        <LabelMedium color={theme.colors.primary} marginRight={'1rem'}>
          Filtrer diagrammene på status
        </LabelMedium>
      </div>
    </div>
  )
}
