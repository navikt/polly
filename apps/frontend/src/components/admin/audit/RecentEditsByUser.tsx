import { HeadingXLarge } from 'baseui/typography'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getRecentEditedProcesses } from '../../../api'
import { ObjectType, RecentEdits } from '../../../constants'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { ObjectLink } from '../../common/RouteLink'

export const RecentEditsByUser = () => {
  const [recentEdits, setRecentEdits] = useState<RecentEdits[]>([])

  useEffect(() => {
    ;(async () => {
      let data: RecentEdits[] = await getRecentEditedProcesses()
      setRecentEdits(data)
    })()
  }, [])

  return (
    <div className="items-center w-full">
      <HeadingXLarge>Mine siste endringer</HeadingXLarge>
      {recentEdits
        .slice(0, 10)
        .sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
        .map((ps: RecentEdits) => (
          <ObjectLink id={ps.process.id} type={ObjectType.PROCESS} hideUnderline key={ps.process.id}>
            <div className="w-full flex justify-between mb-1.5">
              <div className="overflow-hidden whitespace-nowrap text-ellipsis">{ps.process.name}</div>
              <div className="min-w-32 text-right">
                <CustomizedStatefulTooltip content={moment(ps.time).format('lll')}>{moment(ps.time).fromNow()}</CustomizedStatefulTooltip>
              </div>
            </div>
          </ObjectLink>
        ))}
    </div>
  )
}
