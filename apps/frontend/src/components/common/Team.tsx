import { StatefulPopover } from "baseui/popover"
import React, { useEffect, useState } from "react"
import { getTeam } from "../../api/TeamApi"
import { Team } from "../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faTimesCircle, faUser, faUsers } from "@fortawesome/free-solid-svg-icons"
import { copyToClipboard, intl, theme } from "../../util"
import { StatefulTooltip } from "baseui/tooltip"
import { Card, CardOverrides, StyledBody } from "baseui/card"
import { ListItem, ListItemLabel, OverridesT } from "baseui/list"
import { Button } from "baseui/button"
import { IconProp } from "@fortawesome/fontawesome-svg-core"


const defaultTeam = (teamId: string) => ({id: teamId, name: teamId, members: []})

const listOverrides: OverridesT = {
    Content: {
        style: ({$theme}) => ({
            height: $theme.sizing.scale1000
        })
    }
} as OverridesT

const cardOverride: CardOverrides = {
    Body: {
        style: () => ({
            maxHeight: "600px",
            overflowY: "scroll"
        })
    }
}

const SmallIcon = (props: { icon: IconProp }) => <FontAwesomeIcon icon={props.icon} size="sm" style={{marginRight: ".5rem"}}/>

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
            <StatefulPopover content={() =>
                <Card title={team.name} overrides={cardOverride}>
                    <StyledBody>
                        {team.members.map((member, index) =>
                            <ListItem key={index} overrides={listOverrides} endEnhancer={() =>
                                <StatefulTooltip content={`${intl.email} ${member.email} ${intl.copied}!`} triggerType="click" onOpen={() => copyToClipboard(member.email)}>
                                    <Button size="compact" shape="pill" kind="secondary" $style={{marginLeft: "1rem"}}>
                                        <SmallIcon icon={faEnvelope}/> {intl.email}
                                    </Button>
                                </StatefulTooltip>
                            }>
                                <ListItemLabel><SmallIcon icon={faUser}/> {member.name}</ListItemLabel>
                            </ListItem>
                        )}
                    </StyledBody>
                </Card>}>
              <Button size="compact" shape="pill" $style={{paddingTop: theme.sizing.scale100, paddingBottom: theme.sizing.scale100}}>
                <SmallIcon icon={faUsers}/> {team.name}
              </Button>
            </StatefulPopover>
            }
            {error && <StatefulTooltip content={intl.couldntLoadTeam}>
              <span><FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/> {team.name}</span>
            </StatefulTooltip>}
        </>
    )
}