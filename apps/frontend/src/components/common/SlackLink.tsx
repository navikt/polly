import { StyledLink } from 'baseui/link'
import * as React from 'react'
import { env } from '../../util/env'

export const SlackLink = (props: { channel: string }) => {
  const channels = props.channel.replace(/#/g, '').split(',').map(c => c.trim())
  const len = channels.length
  return (
    <>
      {channels.map((c, idx) =>
        <React.Fragment key={idx}>
          <StyledLink href={`https://slack.com/app_redirect?team=${env.slackId}&channel=${c.toLowerCase()}`}
                      target="_blank" rel="noopener noreferrer">
            #{c}
          </StyledLink>
          {idx < len - 1 && <span>, </span>}
        </React.Fragment>
      )}
    </>
  )
}
