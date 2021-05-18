import {KIND, SIZE as ButtonSize} from 'baseui/button'
import {user} from '../../service/User'
import RouteLink from '../common/RouteLink'
import {intl} from '../../util'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHistory} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import Button from '../common/Button'

export const AuditButton = (props: { id: string, auditId?: string, kind?: KIND[keyof KIND], marginLeft?: boolean, marginRight?: boolean, children?: any }) => {
  return user.isAdmin() ?
    <RouteLink href={`/admin/audit/${props.id}` + (props.auditId ? `/${props.auditId}` : '')}>
      {props.children ? props.children :
        <>
          <Button
            tooltip={intl.version}
            marginLeft={props.marginLeft}
            marginRight={props.marginRight}
            size={ButtonSize.compact}
            kind={props.kind || 'outline'}
          >
            <FontAwesomeIcon title={intl.version} icon={faHistory}/>
          </Button>
        </>
      }
    </RouteLink>
    : null
}
