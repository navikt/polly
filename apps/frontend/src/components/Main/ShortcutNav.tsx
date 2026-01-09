import { BodyLong, BodyShort } from '@navikt/ds-react'
import { useState } from 'react'
import { theme } from '../../util'
import { primitives } from '../../util/theme'
import RouteLink from '../common/RouteLink'

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
        <div
          style={{
            width: '320px',
            height: '150px',
            margin: theme.sizing.scale200,
            boxShadow: hover
              ? '0px 4px 2px -1px rgba(0,0,0,0.7)'
              : '0px 0px 6px 3px rgba(0,0,0,0.08)',
            backgroundColor: 'white',
            borderRadius: 4,
          }}
        >
          <div>
            <div className="flex justify-center">
              <BodyLong
                style={{
                  wordBreak: 'break-word',
                  color: hover ? primitives.primary300 : undefined,
                  textDecoration: 'underline',

                  fontWeight: 'bolder',
                  marginTop: theme.sizing.scale300,
                  marginBottom: theme.sizing.scale200,
                }}
              >
                {title}
              </BodyLong>
            </div>

            <div className="flex justify-center w-full">
              <BodyShort>{subtitle}</BodyShort>
            </div>
          </div>
        </div>
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
