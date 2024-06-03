import React, { useEffect, useState } from 'react'
import { getTeam } from '../../api'
import { Team } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { copyToClipboard, theme } from '../../util'
import { Card, StyledBody } from 'baseui/card'
import { ListItem, ListItemLabel, ListOverrides } from 'baseui/list'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { LabelSmall, ParagraphSmall } from 'baseui/typography'
import Button from './Button'
import { SlackLink } from './SlackLink'
import { StyledLink } from 'baseui/link'
import { env } from '../../util/env'
import { Markdown } from './Markdown'
import { ObjectLink } from './RouteLink'
import { Block } from 'baseui/block'
import { DotTag } from './DotTag'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

const defaultTeam = (teamId: string) => ({ id: teamId, name: teamId, description: ' ', productarea: undefined, tags: [], members: [] })

const listOverrides: ListOverrides = {
  Content: {
    style: ({ $theme }) => ({
      height: $theme.sizing.scale1000,
    }),
  },
} as ListOverrides

const SmallIcon = (props: { icon: IconProp }) => <FontAwesomeIcon icon={props.icon} size="sm" style={{ marginRight: '.5rem' }} />

const TeamContent = (props: { team: Team }) => (
  <Card
    title={
      <StyledLink target="_blank" rel="noopener noreferrer" href={`${env.teamKatBaseUrl}team/${props.team.id}`}>
        {props.team.name}
      </StyledLink>
    }
  >
    <StyledBody>
      <dl>
        <dt>
          <LabelSmall>Beskrivelse</LabelSmall>
        </dt>
        <dd>
          <ParagraphSmall>
            <Markdown source={props.team.description} />
          </ParagraphSmall>
        </dd>
        {props.team.slackChannel && (
          <>
            <dt>
              <LabelSmall>Slack-kanal</LabelSmall>
            </dt>
            <dd>
              <SlackLink channel={props.team.slackChannel} />
            </dd>
          </>
        )}
      </dl>

      {props.team.members.map((member, index) => (
        <ListItem
          key={index}
          overrides={listOverrides}
          endEnhancer={() => (
            <CustomizedStatefulTooltip
              content={`Epost ${member.email} kopiert!`}
              triggerType="click"
              onOpen={() => copyToClipboard(member.email || 'Ikke angitt')}
            >
              <span>
                <Button size="compact" shape="pill" kind="secondary">
                  <SmallIcon icon={faEnvelope} /> Epost
                </Button>
              </span>
            </CustomizedStatefulTooltip>
          )}
        >
          <ListItemLabel>
            <SmallIcon icon={faUser} /> {member.name || 'Uavklart'}
          </ListItemLabel>
        </ListItem>
      ))}
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
    getTeam(teamId)
      .then((resp) => update && setTeam(resp))
      .catch((e) => setError(true))
    return () => {
      update = false
    }
  }, [teamId])

  return (
    <>
      {!error ? (
        <ObjectLink id={teamId} type={'team'} key={teamId}>
          {team.name}
        </ObjectLink>
      ) : (
        <CustomizedStatefulTooltip content='Kunne ikke finne team'>
          <span>
            <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500} /> {team.name}
          </span>
        </CustomizedStatefulTooltip>
      )}
    </>
  )
}

export const TeamList = (props: { teamIds: string[] }) => (
  <Block display="flex">
    {props.teamIds.map((t, i) => (
      <DotTag key={i}>
        <TeamView teamId={t} />
      </DotTag>
    ))}
  </Block>
)
