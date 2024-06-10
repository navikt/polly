import { Block, BlockProps } from 'baseui/block'
import { LabelMedium, LabelSmall } from 'baseui/typography'
import React from 'react'
import { AuditAction } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { theme } from '../../../util'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import {tekster} from "../../../util/codeToFineText";

const labelBlockProps: BlockProps = {
  display: ['flex', 'block', 'block', 'flex'],
  width: ['20%', '100%', '100%', '20%'],
  alignSelf: 'flex-start',
}

export const AuditLabel = (props: { label: string; children: any }) => {
  return (
    <Block display={['flex', 'block', 'block', 'flex']}>
      <Block {...labelBlockProps}>
        <LabelMedium>{props.label}</LabelMedium>
      </Block>
      <Block>
        <LabelSmall>{props.children}</LabelSmall>
      </Block>
    </Block>
  )
}

export const AuditActionIcon = (props: { action: AuditAction; withText?: boolean }) => {
  const icon = (props.action === AuditAction.CREATE && { icon: faPlusCircle, color: theme.colors.positive300 }) ||
    (props.action === AuditAction.UPDATE && { icon: faInfoCircle, color: theme.colors.warning300 }) ||
    (props.action === AuditAction.DELETE && { icon: faMinusCircle, color: theme.colors.negative400 }) || { icon: undefined, color: undefined }

  return (
    <CustomizedStatefulTooltip content={() => tekster[props.action] }>
      <Block marginRight=".5rem" display="inline">
        <FontAwesomeIcon icon={icon.icon!} color={icon.color} /> {props.withText && tekster[props.action]}
      </Block>
    </CustomizedStatefulTooltip>
  )
}
