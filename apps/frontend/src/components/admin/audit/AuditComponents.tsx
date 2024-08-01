import { faInfoCircle, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Label } from '@navikt/ds-react'
import { AuditAction } from '../../../constants'
import { theme } from '../../../util'
import { tekster } from '../../../util/codeToFineText'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'

interface IAuditLabelProps {
  label: string
  children: any
}

export const AuditLabel = (props: IAuditLabelProps) => {
  const { label, children } = props

  return (
    <div className="flex">
      <div className="flex w-1/5 self-center">
        <Label>{label}</Label>
      </div>
      {children}
    </div>
  )
}

interface IAuditActionIconProps {
  action: AuditAction
  withText?: boolean
}

export const AuditActionIcon = (props: IAuditActionIconProps) => {
  const { action, withText } = props
  const icon = (action === AuditAction.CREATE && { icon: faPlusCircle, color: theme.colors.positive300 }) ||
    (action === AuditAction.UPDATE && { icon: faInfoCircle, color: theme.colors.warning300 }) ||
    (action === AuditAction.DELETE && { icon: faMinusCircle, color: theme.colors.negative400 }) || { icon: undefined, color: undefined }

  return (
    <CustomizedStatefulTooltip content={() => tekster[action]}>
      <div className="ml-2 inline">
        <FontAwesomeIcon icon={icon.icon!} color={icon.color} /> {withText && tekster[action]}
      </div>
    </CustomizedStatefulTooltip>
  )
}
