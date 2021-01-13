import * as React from 'react'
import {ProcessStatus} from '../../constants'
import {StatefulSelect} from 'baseui/select'
import {intl, theme} from '../../util'
import {Block} from 'baseui/block'
import {useHistory, useParams} from 'react-router-dom'
import {Label2} from "baseui/typography";

export const FilterDashboardStatus = (props: {setFilter: Function}) => {
  const history = useHistory()
  const {processStatus} = useParams<{processStatus: ProcessStatus}>()
  return (
    <Block width='100%' display="flex" flexDirection='row-reverse' marginTop={theme.sizing.scale600}>
      <Block width={"240px"}>
        <StatefulSelect
          backspaceRemoves={false}
          clearable={false}
          deleteRemoves={false}
          escapeClearsValue={false}
          options={[
            {label: intl.all, id: ProcessStatus.All},
            {label: intl.inProgress, id: ProcessStatus.IN_PROGRESS},
            {label: intl.needsRevision, id: ProcessStatus.NEEDS_REVISION},
            {label: intl.done, id: ProcessStatus.COMPLETED},
          ]}
          initialState={{value: [{id: processStatus ? processStatus as ProcessStatus : ProcessStatus.All}]}}
          filterOutSelected={false}
          searchable={false}
          onChange={(params: any) => {
            history.push(`/dashboard/${params.value[0].id}`)
            props.setFilter(params.value[0].id)
          }}
        />
      </Block>
      <Block alignSelf='center'>
        <Label2 color={theme.colors.primary} marginRight={'1rem'}>
          {intl.filterPieChartsByStatus}
        </Label2>
      </Block>
    </Block>)
}
