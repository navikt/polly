import { Block, BlockProps } from 'baseui/block'
import { LabelMedium, LabelSmall } from 'baseui/typography'
import React from 'react'
import { AuditAction } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { theme } from '../../util'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'
import {tekster} from "../../util/codeToFineText";

const labelBlockProps: BlockProps = {
  display: ['flex', 'block', 'block', 'flex'],
  width: ['20%', '100%', '100%', '20%'],
  alignSelf: 'flex-start',
}

export const AuditLabel = (props: { label: string; children: any }) => {
  return (
    <div className="flex lg:flex md:block sm:block">
      <div className="flex lg:flex md:block sm:block w-[20%] lg:w-[20%] md:w-full sm:w-full self-start">
        <LabelMedium>{props.label}</LabelMedium>
      </div>
      <div>
        <LabelSmall>{props.children}</LabelSmall>
      </div>
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
