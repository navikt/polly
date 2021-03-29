import * as React from 'react'
import {useEffect} from 'react'
import {getRecentEditedProcesses} from "../../api";
import {ObjectType, RecentEdits} from "../../constants";
import {Block} from "baseui/block/index";
import {ObjectLink} from "../common/RouteLink";
import CustomizedStatefulTooltip from "../common/CustomizedStatefulTooltip";
import moment from "moment";
import {HeadingMedium} from "baseui/typography";
import {intl, theme} from "../../util";

export const RecentEditsByUser = () => {
  const [recentEdits, setRecentEdits] = React.useState<RecentEdits[]>([]);
  useEffect(() => {
    (async () => {
      let data = await getRecentEditedProcesses()
      setRecentEdits(data)
    })()
  }, [])
  const eventNameCutOff = 68;

  return (
    <Block alignItems='center' width='100%'>
      <HeadingMedium>{intl.userLastChanges}</HeadingMedium>
      {
        recentEdits
          .slice(0, 10)
          .sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf())
          .map(ps =>
            <ObjectLink id={ps.process.id} type={ObjectType.PROCESS} hideUnderline key={ps.process.id}>
              <Block width='100%' display='flex' justifyContent='space-between' marginBottom={theme.sizing.scale200}>
                <Block>
                  {ps.process.name.length < eventNameCutOff ? ps.process.name : ps.process.name.slice(0, eventNameCutOff - 3) + "..."}
                </Block>
                <CustomizedStatefulTooltip content={moment(ps.time).format('lll')}>
                  {moment(ps.time).fromNow()}
                </CustomizedStatefulTooltip>
              </Block>
            </ObjectLink>
          )
      }
    </Block>
  )
}
