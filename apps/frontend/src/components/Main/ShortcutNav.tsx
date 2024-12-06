import { Card, CardOverrides } from 'baseui/card'
import { ParagraphLarge, ParagraphMedium } from 'baseui/typography'
import { useState } from 'react'
import { theme } from '../../util'
import { primitives } from '../../util/theme'
import RouteLink from '../common/RouteLink'
import { borderColor, marginAll } from '../common/Style'

const cardOverrides = (hover: boolean) => {
  return {
    Root: {
      style: () => {
        const base = {
          width: '320px',
          height: '150px',
          margin: theme.sizing.scale200,
        }
        return hover
          ? {
              ...base,
              ...borderColor(primitives.primary500),
              boxShadow: '0px 4px 2px -1px rgba(0,0,0,0.7);',
            }
          : base
      },
    },
    Body: {
      style: () => {
        return {
          marginBottom: 0,
        }
      },
    },
    Contents: {
      style: () => {
        return {
          ...marginAll(theme.sizing.scale600),
        }
      },
    },
    Action: {},
  } as CardOverrides
}

type TShortcutCardProps = {
  title: string
  subtitle: string
  to: string
}

export const ShortcutCard = (props: TShortcutCardProps) => {
  const { title, subtitle, to } = props
  const [hover, setHover] = useState(false)

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <RouteLink href={to} hideUnderline={true}>
        <Card
          overrides={cardOverrides(hover)}
          hasThumbnail={(placeHolder: { readonly thumbnail?: string | undefined }) => {
            return !!placeHolder
          }}
        >
          <div>
            <div className="flex justify-center">
              <ParagraphLarge
                marginTop={theme.sizing.scale300}
                marginBottom={theme.sizing.scale200}
                $style={{
                  wordBreak: 'break-word',
                  color: hover ? primitives.primary300 : undefined,
                  textDecoration: 'underline',
                  fontSize: '130%',
                  fontWeight: 'bolder',
                }}
              >
                {title}
              </ParagraphLarge>
            </div>

            <div className="flex justify-center w-full">
              <ParagraphMedium>{subtitle}</ParagraphMedium>
            </div>
          </div>
        </Card>
      </RouteLink>
    </div>
  )
}

const ShortcutNav = () => (
  <div className="flex justify-between flex-wrap">
    <ShortcutCard title="Behandlinger" subtitle="Se og endre behandlinger" to="/process" />
    <ShortcutCard
      title="Opplysningstyper"
      subtitle="Se og endre opplysningstyper"
      to="/informationtype"
    />
    <ShortcutCard title="Eksterne parter" subtitle="Se alle eksterne parter" to="/thirdparty" />
    <ShortcutCard title="Dashboard" subtitle="Se statistikk over behandlinger" to="/dashboard" />
  </div>
)

export default ShortcutNav
