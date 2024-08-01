import { ClockDashedIcon } from '@navikt/aksel-icons'
import { Button, ButtonProps, Link, Tooltip } from '@navikt/ds-react'
import { user } from '../../../service/User'

interface IAuditButtonProps extends ButtonProps {
  id: string
  auditId?: string
}

export const AuditButtonDS = (props: IAuditButtonProps) => {
  const { id, auditId, children, ...restProps } = props

  return (
    <>
      {!user.isAdmin() && null}
      {user.isAdmin() && (
        <Link href={`/admin/audit/${id}` + (auditId ? `/${auditId}` : '')}>
          {children && children}{' '}
          {!children && (
            <Tooltip content="Versjonering">
              <Button {...restProps} icon={<ClockDashedIcon title="Versjonering" />} />
            </Tooltip>
          )}
        </Link>
      )}
    </>
  )
}
