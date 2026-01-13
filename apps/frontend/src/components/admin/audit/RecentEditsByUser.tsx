import { Heading } from '@navikt/ds-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getRecentEditedProcesses } from '../../../api/GetAllApi'
import { EObjectType, IRecentEdits } from '../../../constants'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { ObjectLink } from '../../common/RouteLink'

export const RecentEditsByUser = () => {
  const [recentEdits, setRecentEdits] = useState<IRecentEdits[]>([])

  useEffect(() => {
    ;(async () => {
      const data: IRecentEdits[] = await getRecentEditedProcesses()
      setRecentEdits(data)
    })()
  }, [])

  return (
    <div className="items-center w-full">
      <Heading size="xlarge" level="2" className="mb-6">
        Mine siste endringer
      </Heading>
      {recentEdits
        .slice(0, 10)
        .sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
        .map((ps: IRecentEdits) => (
          <ObjectLink
            id={ps.process.id}
            type={EObjectType.PROCESS}
            hideUnderline
            key={ps.process.id}
          >
            <div className="w-full flex justify-between mb-1.5">
              <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                {ps.process.name}
              </div>
              <div className="min-w-32 text-right">
                <CustomizedStatefulTooltip
                  content={moment(ps.time).format('lll')}
                  text={moment(ps.time).fromNow()}
                />
              </div>
            </div>
          </ObjectLink>
        ))}
    </div>
  )
}
