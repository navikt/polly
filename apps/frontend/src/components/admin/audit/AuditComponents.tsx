import { InformationSquareIcon, MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons'
import { Label } from '@navikt/ds-react'
import { EAuditAction } from '../../../constants'
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
  action: EAuditAction
  withText?: boolean
}

export const AuditActionIcon = (props: IAuditActionIconProps) => {
  const { action, withText } = props
  const icon = (action === EAuditAction.CREATE && {
    icon: <PlusCircleIcon title="created" color={theme.colors.positive300} />,
    color: theme.colors.positive300,
  }) ||
    (action === EAuditAction.UPDATE && {
      icon: <InformationSquareIcon title="Update" color={theme.colors.warning300} />,
      color: theme.colors.warning300,
    }) ||
    (action === EAuditAction.DELETE && {
      icon: <MinusCircleIcon title="deleted" color={theme.colors.negative400} />,
      color: theme.colors.negative400,
    }) || {
      icon: undefined,
      color: undefined,
    }

  return (
    <CustomizedStatefulTooltip
      content={tekster[action]}
      text={withText ? tekster[action] : undefined}
      color={icon.color}
      icon={icon.icon}
    />
  )
}
