import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, StyledBody } from 'baseui/card'
import { StyledLink } from 'baseui/link'
import { ListItem, ListItemLabel, ListOverrides } from 'baseui/list'
import { LabelSmall, ParagraphSmall } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { getTeam } from '../../api'
import { Member, Team } from '../../constants'
import { copyToClipboard, theme } from '../../util'
import { env } from '../../util/env'
import Button from './Button'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'
import { DotTag } from './DotTag'
import { Markdown } from './Markdown'
import { ObjectLink } from './RouteLink'
import { SlackLink } from './SlackLink'

interface IDefaultTeamProps {
  id: string
  name: string
  description: string
  productarea: undefined
  tags: []
  members: []
}

const defaultTeam = (teamId: string): IDefaultTeamProps => ({ id: teamId, name: teamId, description: ' ', productarea: undefined, tags: [], members: [] })

const listOverrides: ListOverrides = {
  Content: {
    style: ({ $theme }) => ({
      height: $theme.sizing.scale1000,
    }),
  },
} as ListOverrides

interface ISmallIconProps {
  icon: IconProp
}

const SmallIcon = (props: ISmallIconProps) => {
  const { icon } = props

  return <FontAwesomeIcon icon={icon} size="sm" style={{ marginRight: '.5rem' }} />
}

interface ITeamContentProps {
  team: Team
}

const TeamContent = (props: ITeamContentProps) => {
  const { team } = props

  return (
    <Card
      title={
        <StyledLink target="_blank" rel="noopener noreferrer" href={`${env.teamKatBaseUrl}team/${team.id}`}>
          {team.name}
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
              <Markdown source={team.description} />
            </ParagraphSmall>
          </dd>
          {team.slackChannel && (
            <>
              <dt>
                <LabelSmall>Slack-kanal</LabelSmall>
              </dt>
              <dd>
                <SlackLink channel={team.slackChannel} />
              </dd>
            </>
          )}
        </dl>

        {team.members.map((member: Member, index: number) => (
          <ListItem
            key={index}
            overrides={listOverrides}
            endEnhancer={() => (
              <CustomizedStatefulTooltip content={`Epost ${member.email} kopiert!`} triggerType="click" onOpen={() => copyToClipboard(member.email || 'Ikke angitt')}>
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
}

interface ITeamViewProps {
  teamId: string
}

const TeamView = (props: ITeamViewProps) => {
  const { teamId } = props
  const [team, setTeam] = useState<Team>(defaultTeam(teamId))
  const [error, setError] = useState(false)

  useEffect(() => {
    let update = true
    if (team.id !== teamId) {
      setError(false)
      setTeam(defaultTeam(teamId))
    }
    getTeam(teamId)
      .then((response: Team) => update && setTeam(response))
      .catch((error) => setError(true))
    return () => {
      update = false
    }
  }, [teamId])

  return (
    <>
      {!error && (
        <ObjectLink id={teamId} type={'team'} key={teamId}>
          {team.name}
        </ObjectLink>
      )}{' '}
      {error && (
        <CustomizedStatefulTooltip content="Kunne ikke finne team">
          <span>
            <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500} /> {team.name}
          </span>
        </CustomizedStatefulTooltip>
      )}
    </>
  )
}

interface ITeamListProps {
  teamIds: string[]
}

export const TeamList = (props: ITeamListProps) => {
  const { teamIds } = props

  return (
    <div className="flex">
      {teamIds.map((teamId: string, index: number) => (
        <DotTag key={index}>
          <TeamView teamId={teamId} />
        </DotTag>
      ))}
    </div>
  )
}
