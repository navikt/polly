import { useStyletron } from 'baseui'
import { KIND } from 'baseui/button'
import { StyledLink } from 'baseui/link'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { EObjectType, IAuditItem, TNavigableItem } from '../../constants'
import { EListName } from '../../service/Codelist'
import { AuditButton } from '../admin/audit/AuditButton'

type TRouteLinkProps = {
  href: string
  hideUnderline?: boolean
  plain?: boolean
}

const RouteLink = (props: TRouteLinkProps & any) => {
  const { hideUnderline, plain, ...restprops } = props
  const navigate: NavigateFunction = useNavigate()

  const [useCss] = useStyletron()
  const css = useCss({
    textDecoration: hideUnderline ? 'none' : undefined,
    color: plain ? 'inherit !important' : undefined,
  })

  return (
    <StyledLink
      className={css}
      {...restprops}
      onClick={(event: Event) => {
        event.preventDefault()
        navigate(props.href)
      }}
    />
  )
}

export default RouteLink

type TObjectLinkProps = {
  id: string
  type: TNavigableItem
  audit?: IAuditItem
  withHistory?: boolean
  children?: any
  disable?: boolean
  hideUnderline?: boolean
}

export const urlForObject = (type: TNavigableItem, id: string, audit?: IAuditItem) => {
  switch (type) {
    case EObjectType.INFORMATION_TYPE:
      return `/informationtype/${id}`
    case EListName.CATEGORY:
      return `/informationtype?category=${id}`
    case EObjectType.POLICY:
      return `/policy/${id}`
    case EObjectType.PROCESS:
      return `/process/${id}`
    case EObjectType.PROCESSOR:
      return `/processor/${id}`
    case EObjectType.DP_PROCESS:
      return `/dpprocess/${id}`
    case EObjectType.DISCLOSURE:
      return `/disclosure/${id}`
    case EObjectType.DOCUMENT:
      return `/document/${id}`
    case EObjectType.CODELIST:
      return `/admin/codelist/${id.substring(0, id.indexOf('-'))}`
    case EObjectType.GENERIC_STORAGE:
      if (audit && (audit.data as any)?.type === 'SETTINGS') {
        return '/admin/settings'
      }
      return '/'
    case EListName.PURPOSE:
      return `/process/purpose/${id}`
    case 'team':
      return `/team/${id}`
    case 'productarea':
      return `/productarea/${id}`
    case EListName.DEPARTMENT:
      return `/process/department/${id}`
    case EListName.SUB_DEPARTMENT:
      return `/process/subdepartment/${id}`
    case EListName.THIRD_PARTY:
      return `/thirdparty/${id}`
    case EListName.SYSTEM:
      return `/system/${id}`
    case EListName.GDPR_ARTICLE:
      return `/process/legal?gdprArticle=${id}`
    case EListName.NATIONAL_LAW:
      return `/process/legal?nationalLaw=${id}`
  }
}

export const ObjectLink = (props: TObjectLinkProps) => {
  const { disable, children, type, id, audit, hideUnderline, withHistory } = props
  const [useCss] = useStyletron()
  const linkCss = useCss({ textDecoration: 'none' })

  const link = disable ? (
    children
  ) : (
    <RouteLink href={urlForObject(type, id, audit)} className={hideUnderline ? linkCss : undefined}>
      {children}
    </RouteLink>
  )

  return withHistory ? (
    <div className="flex justify-between w-full items-center">
      {link}
      <AuditButton id={id} kind={KIND.tertiary} />
    </div>
  ) : (
    link
  )
}
