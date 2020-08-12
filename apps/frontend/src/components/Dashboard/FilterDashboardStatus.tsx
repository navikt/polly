import * as React from 'react'
import {ProcessStatus} from '../../constants'
import {StatefulSelect} from 'baseui/select'
import {intl} from '../../util'
import {Block} from 'baseui/block'
import {useHistory} from 'react-router-dom'

export const FilterDashboardStatus = (props: { setFilter: Function }) => {
  const history = useHistory()
  return (
    <Block width='100%' display="flex" flexDirection='row-reverse'>
      <Block width={"240px"}>
        <StatefulSelect
          backspaceRemoves={false}
          clearable={false}
          deleteRemoves={false}
          escapeClearsValue={false}
          options={[
            {label: intl.all, id: ProcessStatus.All},
            {label: intl.inProgress, id: ProcessStatus.IN_PROGRESS},
            {label: intl.completed, id: ProcessStatus.COMPLETED},
          ]}
          initialState={{value: [{id: ProcessStatus.All}]}}
          filterOutSelected={false}
          searchable={false}
          onChange={(params: any) => {
            history.push(`${params.value[0].id}`)
            props.setFilter(params.value[0].id)
          }}
        />
      </Block>
    </Block>)
}
