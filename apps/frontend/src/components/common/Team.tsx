import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { getTeam } from '../../api'
import { ITeam } from '../../constants'
import { theme } from '../../util'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'
import { DotTag } from './DotTag'
import { ObjectLink } from './RouteLink'

interface IDefaultTeamProps {
  id: string
  name: string
  description: string
  productarea: undefined
  tags: []
  members: []
}

const defaultTeam = (teamId: string): IDefaultTeamProps => ({
  id: teamId,
  name: teamId,
  description: ' ',
  productarea: undefined,
  tags: [],
  members: [],
})

interface ITeamViewProps {
  teamId: string
}

const TeamView = (props: ITeamViewProps) => {
  const { teamId } = props
  const [team, setTeam] = useState<ITeam>(defaultTeam(teamId))
  const [error, setError] = useState(false)

  useEffect(() => {
    let update = true
    if (team.id !== teamId) {
      setError(false)
      setTeam(defaultTeam(teamId))
    }
    getTeam(teamId)
      .then((response: ITeam) => update && setTeam(response))
      .catch(() => setError(true))
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
      )}
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
