import { StyledLink } from 'baseui/link'
import { Fragment } from 'react/jsx-runtime'
import { slackRedirectUrl } from '../../util/config'

export const SlackLink = (props: { channel: string }) => {
  const channels = props.channel
    .replace(/#/g, '')
    .split(',')
    .map((c) => c.trim())
  const len = channels.length

  return (
    <>
      {channels.map((c, idx) => (
        <Fragment key={idx}>
          <StyledLink href={slackRedirectUrl(c)} target="_blank" rel="noopener noreferrer">
            #{c}
          </StyledLink>
          {idx < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}
