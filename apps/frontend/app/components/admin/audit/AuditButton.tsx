'use client'

import { ClockDashedIcon } from '@navikt/aksel-icons'
import { FunctionComponent, useContext } from 'react'
import { IUserContext, UserContext } from '../../../service/User'
import Button from '../../common/Button/CustomButton'
import RouteLink from '../../common/RouteLink'

interface IProps {
  id: string
  auditId?: string
  kind?:
    | 'primary'
    | 'primary-neutral'
    | 'secondary'
    | 'secondary-neutral'
    | 'tertiary'
    | 'tertiary-neutral'
    | 'danger'
    | 'outline'
  marginLeft?: boolean
  marginRight?: boolean
  children?: any
}

export const AuditButton: FunctionComponent<IProps> = ({
  id,
  auditId,
  kind,
  marginLeft,
  marginRight,
  children,
}) => {
  const user: IUserContext = useContext(UserContext)

  return (
    <>
      {!user.isAdmin() && null}
      {user.isAdmin() && (
        <RouteLink href={`/admin/audit/${id}` + (auditId ? `/${auditId}` : '')}>
          {children && children}{' '}
          {!children && (
            <>
              <Button
                tooltip='Versjonering'
                marginLeft={marginLeft}
                marginRight={marginRight}
                size='xsmall'
                kind={kind || 'outline'}
                ariaLabel='Versjonering'
                startEnhancer={
                  <span className='flex items-center leading-none'>
                    <ClockDashedIcon aria-hidden className='block' />
                  </span>
                }
              ></Button>
            </>
          )}
        </RouteLink>
      )}
    </>
  )
}
