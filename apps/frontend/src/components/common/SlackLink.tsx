import { Link } from '@navikt/ds-react'
import { Fragment } from 'react/jsx-runtime'
import { slackRedirectUrl } from '../../util/config'

interface IProps {
  channel: string
}

export const SlackLink = (props: IProps) => {
  const { channel } = props

  const channels = channel
    .replace(/#/g, '')
    .split(',')
    .map((c) => c.trim())
  const len: number = channels.length

  return (
    <>
      {channels.map((channel: string, index: number) => (
        <Fragment key={index}>
          <Link href={slackRedirectUrl(channel)} target="_blank" rel="noopener noreferrer">
            #{channel}
          </Link>
          {index < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}
