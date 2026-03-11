import { Link } from '@navikt/ds-react'
import type { MouseEvent } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
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

  // Treat absolute URLs (https:, mailto:, //example.com, etc.) as external.
  const isExternalHref = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href)

  const className = [
    restprops.className,
    hideUnderline ? 'no-underline' : undefined,
    plain ? 'text-inherit' : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link
      className={className}
      {...restprops}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        restprops.onClick?.(event)
        if (isExternalHref) return
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

  const linkClassName = hideUnderline ? 'no-underline' : undefined

  const link = disable ? (
    children
  ) : (
    <RouteLink href={urlForObject(type, id, audit)} className={linkClassName}>
      {children}
    </RouteLink>
  )

  return withHistory ? (
    <div className="flex justify-between w-full items-center">
      {link}
      <AuditButton id={id} kind="tertiary" />
    </div>
  ) : (
    link
  )
}
