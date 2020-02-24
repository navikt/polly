import { KIND, SIZE as ButtonSize } from "baseui/button"
import { user } from "../../service/User"
import RouteLink from "../common/RouteLink"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { intl, theme } from "../../util"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import Button from "../common/Button"
import { Block } from "baseui/block"

export const AuditButton = (props: { id: string, auditId?: string, kind?: KIND[keyof KIND], children?: any }) => {
  return user.isAdmin() ?
    <RouteLink href={`/admin/audit/${props.id}` + (props.auditId ? `/${props.auditId}` : '')}>
      {props.children ? props.children :
        <>
          <StatefulTooltip content={intl.version} placement={PLACEMENT.top}>
            <Button
              size={ButtonSize.compact}
              kind={props.kind || 'outline'}
            >
              <FontAwesomeIcon icon={faHistory}/>
            </Button>
          </StatefulTooltip>
          <Block display="inline" marginRight={theme.sizing.scale500}/>
        </>
      }
    </RouteLink>
    : null
}
