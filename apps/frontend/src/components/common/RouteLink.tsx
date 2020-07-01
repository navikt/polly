import {RouteComponentProps, withRouter} from 'react-router-dom'
import {StyledLink} from 'baseui/link'
import React from 'react'
import {KIND} from 'baseui/button'
import {Block} from 'baseui/block'
import {AuditButton} from '../audit/AuditButton'
import {AuditItem, NavigableItem, ObjectType} from '../../constants'
import {useStyletron} from 'baseui'
import {ListName} from '../../service/Codelist'

type RouteLinkProps = {
  href: string
}

const RouteLinkImpl = (props: RouteComponentProps<any> & RouteLinkProps & any) => {
  const { history, location, match, staticContext, ...restprops } = props
  return (
    <StyledLink {...restprops} onClick={(e: Event) => {
      e.preventDefault()
      props.history.push(props.href)
    }} />
  )
}

const RouteLink = withRouter(RouteLinkImpl)
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
  }
}

const ObjectLinkImpl = (props: RouteComponentProps & ObjectLinkProps) => {
  const [useCss] = useStyletron()
  const linkCss = useCss({ textDecoration: 'none' })

  const link =
    props.disable ? props.children :
      <RouteLink href={urlForObject(props.type, props.id, props.audit)}
        className={props.hideUnderline ? linkCss : undefined}>
        {props.children}
      </RouteLink>

  return props.withHistory ?
    <Block display="flex" justifyContent="space-between" width="100%" alignItems="center">
      {link}
      <AuditButton id={props.id} kind={KIND.tertiary} />
    </Block> :
    link
}

export const ObjectLink = withRouter(ObjectLinkImpl)
