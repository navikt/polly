import {Block} from 'baseui/block'
import {Card, CardOverrides} from 'baseui/card'
import {H6, Paragraph2} from 'baseui/typography'
import * as React from 'react'
import {intl, theme} from '../../util'
import {primitives} from '../../util/theme'
import RouteLink from '../common/RouteLink'
import {borderColor, marginAll} from '../common/Style'

const cardOverrides = (hover: boolean) => {
  return {
    Root: {
      style: () => {
        const base = {
          width: '320px',
          height: '150px',
          margin: theme.sizing.scale200,
        }
        return hover ? {
          ...base,
          ...borderColor(primitives.primary500),
          boxShadow: '0px 4px 2px -1px rgba(0,0,0,0.7);'
        } : base
      }
    },
    Body: {
      style: () => {
        return {
          marginBottom: 0
        }
      }
    },
    Contents: {
      style: () => {
        return {
          ...marginAll(theme.sizing.scale600),
        }
      }
    }
  } as CardOverrides
}

type ShortcutCardProps = {
  title: string
  subtitle: string
  to: string
}

export const ShortcutCard = (props: ShortcutCardProps) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <RouteLink href={props.to} style={{textDecoration: "none"}} hideUnderline plain>
        <Card overrides={cardOverrides(hover)}>
          <Block>

            <Block display="flex" justifyContent="center">
              <H6 marginTop={theme.sizing.scale300} marginBottom={theme.sizing.scale200} $style={{
                wordBreak: 'break-word',
                color: hover ? primitives.primary300 : undefined,
                textDecoration: 'underline'
              }}>{props.title}</H6>
            </Block>

            <Block display="flex" justifyContent="center" width="100%">
                <Paragraph2>{props.subtitle}</Paragraph2>
            </Block>

          </Block>
        </Card>
      </RouteLink>
    </div>
  )
}

const ShortcutNav = () => {

  return (
    <Block display="flex" justifyContent="space-between" flexWrap>
     <ShortcutCard title={intl.processes} subtitle={intl.shortcutSubtitleProcess}  to="/process"/>
     <ShortcutCard title={intl.informationTypes} subtitle={intl.shortcutSubtitleInformationtype} to="/informationtype" />
     <ShortcutCard title={intl.thirdParties} subtitle={intl.shortcutSubtitleThirdParty} to="/thirdparty" />
     <ShortcutCard title={intl.dashboard} subtitle={intl.shortcutSubtitleDashboard}  to="/dashboard" />
    </Block>
  )
}

export default ShortcutNav
