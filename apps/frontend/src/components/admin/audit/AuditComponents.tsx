import React from 'react'
import { AuditAction } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { theme } from '../../../util'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import {tekster} from "../../../util/codeToFineText";
import {Label} from "@navikt/ds-react";


export const AuditLabel = (props: { label: string; children: any }) => {
  return (
    <div className="flex">
      <div className="flex w-1/5 self-center">
        <Label>{props.label}</Label>
      </div>
      {props.children}
    </div>
  )
}

export const AuditActionIcon = (props: { action: AuditAction; withText?: boolean }) => {
  const icon = (props.action === AuditAction.CREATE && { icon: faPlusCircle, color: theme.colors.positive300 }) ||
    (props.action === AuditAction.UPDATE && { icon: faInfoCircle, color: theme.colors.warning300 }) ||
    (props.action === AuditAction.DELETE && { icon: faMinusCircle, color: theme.colors.negative400 }) || { icon: undefined, color: undefined }

  return (
    <CustomizedStatefulTooltip content={() => tekster[props.action] }>
      <div className="ml-2 inline">
        <FontAwesomeIcon icon={icon.icon!} color={icon.color} /> {props.withText && tekster[props.action]}
      </div>
    </CustomizedStatefulTooltip>
  )
}
