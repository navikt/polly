import { Overrides, StatefulPopover } from 'baseui/popover'
import React, { useEffect, useState } from 'react'
import { getTeam } from '../../api/TeamApi'
import { Team } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faTimesCircle, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { copyToClipboard, intl, theme } from '../../util'
import { PLACEMENT, StatefulTooltip } from 'baseui/tooltip'
import { Card, StyledBody } from 'baseui/card'
import { ListItem, ListItemLabel, OverridesT } from 'baseui/list'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Label3, Paragraph3 } from 'baseui/typography'
import Button from './Button'
import { SlackLink } from './SlackLink'
import ReactMarkdown from 'react-markdown'
import { StyledLink } from 'baseui/link'
import { env } from '../../util/env'


const defaultTeam = (teamId: string) => ({id: teamId, name: teamId, description: ' ', members: []})

const listOverrides: OverridesT = {
  Content: {
    style: ({$theme}) => ({
      height: $theme.sizing.scale1000
    })
  }
} as OverridesT

const popoverOverride: Overrides = {
  Body: {
    style: () => ({
      maxWidth: '60%',
      maxHeight: '80%',
      overflowY: 'scroll'
    })
  }
}

const SmallIcon = (props: { icon: IconProp }) => <FontAwesomeIcon icon={props.icon} size="sm" style={{marginRight: '.5rem'}}/>

const TeamContent = (props: { team: Team }) => (
  <Card title={
    <StyledLink target="_blank" rel="noopener noreferrer"
                href={`${env.teamKatBaseUrl}team/${props.team.id}`}>{props.team.name}</StyledLink>}
  >
    <StyledBody>
      <dl>
        <dt><Label3>{intl.description}</Label3></dt>
        <dd><Paragraph3>
          <ReactMarkdown source={props.team.description} linkTarget='_blank'/>
        </Paragraph3></dd>
        {props.team.slackChannel && <>
          <dt><Label3>{intl.slack}</Label3></dt>
          <dd><SlackLink channel={props.team.slackChannel}/></dd>
        </>}
      </dl>

      {props.team.members.map((member, index) =>
        <ListItem key={index} overrides={listOverrides} endEnhancer={() =>
          <StatefulTooltip content={`${intl.email} ${member.email} ${intl.copied}!`} triggerType="click" onOpen={() => copyToClipboard(member.email)} placement={PLACEMENT.top}>
                        <span>
                          <Button size="compact" shape="pill" kind="secondary">
                            <SmallIcon icon={faEnvelope}/> {intl.email}
                        </Button>
                        </span>
          </StatefulTooltip>
        }>
          <ListItemLabel><SmallIcon icon={faUser}/> {member.name}</ListItemLabel>
        </ListItem>
      )}
    </StyledBody>
  </Card>
)

export const TeamPopover = (props: { teamId: string }) => {
  const teamId = props.teamId
  const [team, setTeam] = useState<Team>(defaultTeam(props.teamId))
  const [error, setError] = useState(false)

  useEffect(() => {
    let update = true
    if (team.id !== teamId) {
      setError(false)
      setTeam(defaultTeam(teamId))
    }
    getTeam(teamId).then(resp => update && setTeam(resp)).catch(e => setError(true))
    return () => {
      update = false
    }
  }, [teamId])

  return (
    <>
      {!error &&
      <StatefulPopover content={() => <TeamContent team={team}/>} overrides={popoverOverride} placement="left">
        <span>
        <Button size="compact" shape="pill" kind="outline" inline>
          <SmallIcon icon={faUsers}/> {team.name}
        </Button>
        </span>
      </StatefulPopover>
      }
      {error && <StatefulTooltip content={intl.couldntLoadTeam} placement={PLACEMENT.top}>
        <span><FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/> {team.name}</span>
      </StatefulTooltip>}
    </>
  )
}
