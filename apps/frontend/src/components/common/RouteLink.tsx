import { useStyletron } from 'baseui'
import { KIND } from 'baseui/button'
import { StyledLink } from 'baseui/link'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AuditItem, NavigableItem, ObjectType } from '../../constants'
import { ListName } from '../../service/Codelist'
import { AuditButton } from '../admin/audit/AuditButton'

type RouteLinkProps = {
  href: string
  hideUnderline?: boolean
  plain?: boolean
}

const RouteLink = (props: RouteLinkProps & any) => {
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

type ObjectLinkProps = {
  id: string
  type: NavigableItem
  audit?: AuditItem
  withHistory?: boolean
  children?: any
  disable?: boolean
  hideUnderline?: boolean
}

export const urlForObject = (type: NavigableItem, id: string, audit?: AuditItem) => {
  switch (type) {
    case ObjectType.INFORMATION_TYPE:
      return `/informationtype/${id}`
    case ListName.CATEGORY:
      return `/informationtype?category=${id}`
    case ObjectType.POLICY:
      return `/policy/${id}`
    case ObjectType.PROCESS:
      return `/process/${id}`
    case ObjectType.PROCESSOR:
      return `/processor/${id}`
    case ObjectType.DP_PROCESS:
      return `/dpprocess/${id}`
    case ObjectType.DISCLOSURE:
      return `/disclosure/${id}`
    case ObjectType.DOCUMENT:
      return `/document/${id}`
    case ObjectType.CODELIST:
      return `/admin/codelist/${id.substring(0, id.indexOf('-'))}`
    case ObjectType.GENERIC_STORAGE:
      if (audit && (audit.data as any)?.type === 'SETTINGS') {
        return '/admin/settings'
      }
      return '/'
    case ListName.PURPOSE:
      return `/process/purpose/${id}`
    case 'team':
      return `/team/${id}`
    case 'productarea':
      return `/productarea/${id}`
    case ListName.DEPARTMENT:
      return `/process/department/${id}`
    case ListName.SUB_DEPARTMENT:
      return `/process/subdepartment/${id}`
    case ListName.THIRD_PARTY:
      return `/thirdparty/${id}`
    case ListName.SYSTEM:
      return `/system/${id}`
    case ListName.GDPR_ARTICLE:
      return `/process/legal?gdprArticle=${id}`
    case ListName.NATIONAL_LAW:
      return `/process/legal?nationalLaw=${id}`
  }
}

export const ObjectLink = (props: ObjectLinkProps) => {
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
