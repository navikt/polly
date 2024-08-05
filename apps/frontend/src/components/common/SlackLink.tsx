import { StyledLink } from 'baseui/link'
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
          <StyledLink href={slackRedirectUrl(channel)} target="_blank" rel="noopener noreferrer">
            #{channel}
          </StyledLink>
          {index < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}
