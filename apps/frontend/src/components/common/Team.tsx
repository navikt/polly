import React, {useEffect, useState} from 'react'
import {getTeam} from '../../api'
import {Team} from '../../constants'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope, faTimesCircle, faUser} from '@fortawesome/free-solid-svg-icons'
import {copyToClipboard, intl, theme} from '../../util'
import {Card, StyledBody} from 'baseui/card'
import {ListItem, ListItemLabel, OverridesT} from 'baseui/list'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {Label3, Paragraph3} from 'baseui/typography'
import Button from './Button'
import {SlackLink} from './SlackLink'
import {StyledLink} from 'baseui/link'
import {env} from '../../util/env'
import {Markdown} from './Markdown'
import {ObjectLink} from './RouteLink'
import {Block} from 'baseui/block'
import {DotTag} from './DotTag'
import CustomizedStatefulTooltip from "./CustomizedStatefulTooltip";


const defaultTeam = (teamId: string) => ({id: teamId, name: teamId, description: ' ', productarea: undefined, tags: [], members: []})

const listOverrides: OverridesT = {
  Content: {
    style: ({$theme}) => ({
      height: $theme.sizing.scale1000
    })
  }
} as OverridesT


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
          <Markdown source={props.team.description}/>
        </Paragraph3></dd>
        {props.team.slackChannel && <>
          <dt><Label3>{intl.slack}</Label3></dt>
          <dd><SlackLink channel={props.team.slackChannel}/></dd>
        </>}
      </dl>

      {props.team.members.map((member, index) =>
        <ListItem key={index} overrides={listOverrides} endEnhancer={() =>
          <CustomizedStatefulTooltip content={`${intl.email} ${member.email} ${intl.copied}!`} triggerType="click"
                                     onOpen={() => copyToClipboard(member.email || intl.emptyMessage)}>
                        <span>
                          <Button size="compact" shape="pill" kind="secondary">
                            <SmallIcon icon={faEnvelope}/> {intl.email}
                        </Button>
                        </span>
          </CustomizedStatefulTooltip>
        }>
          <ListItemLabel><SmallIcon icon={faUser}/> {member.name || intl.unknown}</ListItemLabel>
        </ListItem>
      )}
    </StyledBody>
  </Card>
)

const TeamView = (props: { teamId: string }) => {
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
      {!error ?
        (<ObjectLink id={teamId} type={'team'} key={teamId}>
          {team.name}
        </ObjectLink>) :
        (<CustomizedStatefulTooltip content={intl.couldntLoadTeam}>
          <span><FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/> {team.name}</span>
        </CustomizedStatefulTooltip>)
      }
    </>
  )
}

export const TeamList = (props: { teamIds: string[] }) =>
  <Block display='inline-flex'>
    {props.teamIds.map((t, i) =>
      <DotTag key={i}>
        <TeamView teamId={t}/>
      </DotTag>
    )}
  </Block>
