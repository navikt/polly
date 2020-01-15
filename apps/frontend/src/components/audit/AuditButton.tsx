import { Button, KIND, SIZE as ButtonSize } from "baseui/button"
import { user } from "../../service/User"
import RouteLink from "../common/RouteLink"
import { StatefulTooltip } from "baseui/tooltip"
import { intl, theme } from "../../util"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory } from "@fortawesome/free-solid-svg-icons"
import React from "react"

export const AuditButton = (props: { id: string, auditId?: string, kind?: KIND[keyof KIND], children?: any }) => {
    return user.isAdmin() ?
        <RouteLink href={`/admin/audit/${props.id}` + (props.auditId ? `/${props.auditId}` : '')}>
            {props.children ? props.children :
                <StatefulTooltip content={intl.version}>
                    <Button
                        size={ButtonSize.compact}
                        kind={props.kind || KIND.secondary}
                        overrides={{
                            BaseButton: {
                                style: () => {
                                    return {marginRight: theme.sizing.scale500}
                                }
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faHistory}/>
                    </Button>
                </StatefulTooltip>
            }
        </RouteLink>
        : null
}