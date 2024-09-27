import { faHistory } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SIZE as ButtonSize, KIND } from 'baseui/button'
import { user } from '../../../service/User'
import Button from '../../common/Button'
import RouteLink from '../../common/RouteLink'

interface IProps {
  id: string
  auditId?: string
  kind?: (typeof KIND)[keyof typeof KIND]
  marginLeft?: boolean
  marginRight?: boolean
  children?: any
}

export const AuditButton = (props: IProps) => {
  const { id, auditId, kind, marginLeft, marginRight, children } = props

  return (
    <>
      {!user.isAdmin() && null}
      {user.isAdmin() && (
        <RouteLink href={`/admin/audit/${id}` + (auditId ? `/${auditId}` : '')}>
          {children && children}{' '}
          {!children && (
            <>
              <Button
                tooltip="Versjonering"
                marginLeft={marginLeft}
                marginRight={marginRight}
                size={ButtonSize.compact}
                kind={kind || 'outline'}
              >
                <FontAwesomeIcon title="Versjonering" icon={faHistory} />
              </Button>
            </>
          )}
        </RouteLink>
      )}
    </>
  )
}
