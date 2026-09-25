'use client'

import { ClockDashedIcon } from '@navikt/aksel-icons'
import { Button, ButtonProps, Link, Tooltip } from '@navikt/ds-react'
import { FunctionComponent, useContext } from 'react'
import { IUserContext, UserContext } from '@/provider/userProvider'

interface IAuditButtonProps extends ButtonProps {
  id: string
  auditId?: string
}

export const AuditButtonDS: FunctionComponent<IAuditButtonProps> = ({
  id,
  auditId,
  children,
  ...restProps
}) => {
  const user: IUserContext = useContext(UserContext)

  return (
    <>
      {user.isAdmin() && (
        <Link href={`/admin/audit/${id}` + (auditId ? `/${auditId}` : '')}>
          {children && children}{' '}
          {!children && (
            <Tooltip content='Versjonering'>
              <Button {...restProps} icon={<ClockDashedIcon title='Versjonering' />} />
            </Tooltip>
          )}
        </Link>
      )}
    </>
  )
}
