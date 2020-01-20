import { Overrides, StatefulPopover } from "baseui/popover"
import React, { useEffect, useState } from "react"
import { getTeam } from "../../api/TeamApi"
import { Team } from "../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faTimesCircle, faUser, faUsers } from "@fortawesome/free-solid-svg-icons"
import { copyToClipboard, intl, theme } from "../../util"
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip"
import { Card, StyledBody } from "baseui/card"
import { ListItem, ListItemLabel, OverridesT } from "baseui/list"
import { Button } from "baseui/button"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Label3, Paragraph3 } from "baseui/typography"


const defaultTeam = (teamId: string) => ({id: teamId, name: teamId, members: []})

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
            maxWidth: "60%",
            maxHeight: "80%",
            overflowY: "scroll"
        })
    }
}

const SmallIcon = (props: { icon: IconProp }) => <FontAwesomeIcon icon={props.icon} size="sm" style={{marginRight: ".5rem"}}/>

const TeamContent = (props: { team: Team }) => (
    <Card title={props.team.name}>
        <StyledBody>
            <dl>
                <dt><Label3>{intl.description}</Label3></dt>
                <dd><Paragraph3>Omslag nødvendige håndskrift igjennem overlegent forretningsplanen innlagt, vingene forlatelse deilige inntektskilder noe en besynderlighet. Beviset
                    betrodd frelste navne tiltrer De, trappetrinn sykebesøk efter spesier, forlatelse ringeaktende forestillet avtredende skrape jeg. </Paragraph3></dd>
                <dt><Label3>{intl.slack}</Label3></dt>
                <dd><Paragraph3>#kommer</Paragraph3></dd>
            </dl>

            {props.team.members.map((member, index) =>
                <ListItem key={index} overrides={listOverrides} endEnhancer={() =>
                    <StatefulTooltip content={`${intl.email} ${member.email} ${intl.copied}!`} triggerType="click" onOpen={() => copyToClipboard(member.email)} placement={PLACEMENT.top}>
                        <Button size="compact" shape="pill" kind="secondary" $style={{marginLeft: "1rem"}}>
                            <SmallIcon icon={faEnvelope}/> {intl.email}
                        </Button>
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
              <Button size="compact" shape="pill" $style={{paddingTop: theme.sizing.scale100, paddingBottom: theme.sizing.scale100}}>
                <SmallIcon icon={faUsers}/> {team.name}
              </Button>
            </StatefulPopover>
            }
            {error && <StatefulTooltip content={intl.couldntLoadTeam} placement={PLACEMENT.top}>
              <span><FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/> {team.name}</span>
            </StatefulTooltip>}
        </>
    )
}
