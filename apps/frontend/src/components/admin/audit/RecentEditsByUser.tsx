import { Heading } from '@navikt/ds-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getRecentEditedProcesses } from '../../../api/GetAllApi'
import { EObjectType, IRecentEdits } from '../../../constants'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import RouteLink, { urlForObject } from '../../common/RouteLink'

export const RecentEditsByUser = () => {
  const [recentEdits, setRecentEdits] = useState<IRecentEdits[]>([])

  useEffect(() => {
    ;(async () => {
      const data: IRecentEdits[] = await getRecentEditedProcesses()
      setRecentEdits(data)
    })()
  }, [])

  return (
    <div className="items-center w-full min-w-0">
      <Heading size="xlarge" level="2" className="mb-6">
        Mine siste endringer
      </Heading>
      {recentEdits
        .slice(0, 10)
        .sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
        .map((ps: IRecentEdits) => (
          <RouteLink
            href={urlForObject(EObjectType.PROCESS, ps.process.id)}
            hideUnderline
            key={ps.process.id}
            className="block w-full min-w-0"
          >
            <div className="w-full flex flex-col sm:flex-row sm:justify-between mb-1.5 min-w-0 gap-1 sm:gap-2">
              <div className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                {ps.process.name}
              </div>
              <div className="sm:min-w-32 sm:text-right">
                <CustomizedStatefulTooltip
                  content={moment(ps.time).format('lll')}
                  text={moment(ps.time).fromNow()}
                />
              </div>
            </div>
          </RouteLink>
        ))}
    </div>
  )
}
