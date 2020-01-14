import { StatefulPopover } from "baseui/popover"
import React, { useEffect, useState } from "react"
import { getTeam } from "../../api/TeamApi"
import { Member, Team } from "../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faTimesCircle, faUser, faUsers } from "@fortawesome/free-solid-svg-icons"
import { copyToClipboard, intl, theme } from "../../util"
import { StatefulTooltip } from "baseui/tooltip"
import { Card, StyledBody } from "baseui/card"
import { ListItem, ListItemLabel, OverridesT } from "baseui/list"
import { Button } from "baseui/button"


const defaultTeam = (teamId: string) => ({id: teamId, name: teamId, members: []})

export const TeamPopover = (props: { teamId: string }) => {
    const [team, setTeam] = useState<Team>(defaultTeam(props.teamId))
    const [error, setError] = useState(false)

    useEffect(() => {
        if (team.id !== props.teamId) {
            setError(false)
            setTeam(defaultTeam(props.teamId))
        }
        (async () => {
            try {
                const team = await getTeam(props.teamId)
                setTeam(team)
            } catch (e) {
                console.error(e)
                setError(true)
            }
        })()
    }, [props.teamId])

    const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/>
    const copyEmail = (member: Member) => () => copyToClipboard(member.email)

    const listOverrides = {Content: {style: ({$theme}) => ({height: $theme.sizing.scale1000})}} as OverridesT

    return (
        <>
            {!error &&
            <StatefulPopover content={() =>
                <Card title={team.name} overrides={{
                    Body: {
                        style: () => ({
                            maxHeight: "600px",
                            overflowY: "scroll"
                        })
                    }
                }}>
                    <StyledBody>
                        {team.members.map((member, index) =>
                            <ListItem key={index} overrides={listOverrides} endEnhancer={() =>
                                <StatefulTooltip content={`${intl.copied} ${member.email}`} triggerType="click">
                                    <Button size="compact" shape="pill" $style={{marginLeft: "1rem"}} onClick={copyEmail(member)}>
                                        <FontAwesomeIcon icon={faEnvelope} size="sm" style={{marginRight: ".5rem"}}/> {intl.email}
                                    </Button>
                                </StatefulTooltip>
                            }>
                                <ListItemLabel><FontAwesomeIcon icon={faUser} size="sm" style={{marginRight: ".5rem"}}/> {member.name}</ListItemLabel>
                            </ListItem>
                        )}
                    </StyledBody>
                </Card>}>
              <Button size="compact" shape="pill" $style={{paddingTop: theme.sizing.scale100, paddingBottom: theme.sizing.scale100}}>
                <FontAwesomeIcon icon={faUsers} size="sm" style={{marginRight: ".5rem"}}/> {team.name}
              </Button>
            </StatefulPopover>
            }
            {error && <StatefulTooltip content={intl.couldntLoadTeam}><span>{errorIcon} {team.name}</span></StatefulTooltip>}
        </>
    )
}