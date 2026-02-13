import { InformationSquareIcon, MinusCircleIcon, PlusCircleIcon } from '@navikt/aksel-icons'
import { Label } from '@navikt/ds-react'
import { EAuditAction } from '../../../constants'
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
  const iconStyle = { transform: 'translateY(1px)' } as const
  const icon = (action === EAuditAction.CREATE && {
    icon: <PlusCircleIcon title="Opprett" style={iconStyle} />,
    color: undefined,
  }) ||
    (action === EAuditAction.UPDATE && {
      icon: <InformationSquareIcon title="Oppdater" style={iconStyle} />,
      color: undefined,
    }) ||
    (action === EAuditAction.DELETE && {
      icon: <MinusCircleIcon title="Slett" style={iconStyle} />,
      color: undefined,
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
