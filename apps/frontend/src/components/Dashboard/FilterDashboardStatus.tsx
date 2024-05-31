import * as React from 'react'
import { ProcessStatusFilter } from '../../constants'
import { StatefulSelect } from 'baseui/select'
import { theme } from '../../util'
import { Block } from 'baseui/block'
import { useNavigate, useParams } from 'react-router-dom'
import { LabelMedium } from 'baseui/typography'

export const FilterDashboardStatus = (props: { setFilter: Function }) => {
  const navigate = useNavigate()
  const { processStatus } = useParams<{ processStatus: ProcessStatusFilter }>()
  return (
    <Block width="100%" display="flex" flexDirection="row-reverse" marginTop={theme.sizing.scale600}>
      <Block width={'240px'}>
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
            props.setFilter(params.value[0].id)
          }}
        />
      </Block>
      <Block alignSelf="center">
        <LabelMedium color={theme.colors.primary} marginRight={'1rem'}>
          Filtrer diagrammene på status
        </LabelMedium>
      </Block>
    </Block>
  )
}
