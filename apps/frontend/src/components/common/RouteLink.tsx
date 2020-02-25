import { RouteComponentProps, withRouter } from "react-router-dom";
import { StyledLink } from "baseui/link"
import React from "react"
import { KIND } from "baseui/button"
import { getDisclosure, getPolicy, getProcess } from "../../api"
import { Block } from "baseui/block"
import { AuditButton } from "../audit/AuditButton"
import { AuditItem, NavigableItem, ObjectType } from "../../constants"
import { useStyletron } from "baseui"
import { ListName } from "../../service/Codelist"

type RouteLinkProps = {
  href: string
}

const RouteLinkImpl = (props: RouteComponentProps<any> & RouteLinkProps & any) => {
  const {history, location, match, staticContext, ...restprops} = props
  return (
    <StyledLink {...restprops} onClick={(e: Event) => {
      e.preventDefault()
      props.history.push(props.href)
    }}/>
  )
}

export default withRouter(RouteLinkImpl)

type ObjectLinkProps = {
  id: string
  type: NavigableItem
  audit?: AuditItem
  withHistory?: boolean
  children?: any
  disable?: boolean
  hideUnderline?: boolean
}

export const urlForObject = async (type: NavigableItem, id: string, audit?: AuditItem) => {
  switch (type) {
    case ObjectType.INFORMATION_TYPE:
      return `/informationtype/${id}`
    case ObjectType.POLICY:
      const policy = await getPolicy(id)
      return `/process/purpose/${policy.purposeCode.code}/${policy.process.id}`
    case ObjectType.PROCESS:
      const process = await getProcess(id)
      return `/process/purpose/${process.purposeCode}/${process.id}`
    case ObjectType.DISCLOSURE:
      const disclosure = await getDisclosure(id)
      return `/thirdparty/${disclosure.recipient.code}`
    case ObjectType.DOCUMENT:
      return `/document/${id}`
    case ObjectType.CODELIST:
      return `/admin/codelist/${id.substring(0, id.indexOf('-'))}`
    case ObjectType.GENERIC_STORAGE:
      if (audit && (audit.data as any)?.type === 'SETTINGS') {
        return '/admin/settings'
      }
      break;
    case ListName.PURPOSE:
      return `/process/purpose/${id}`
    case 'team':
      return `/process/team/${id}`
    case ListName.DEPARTMENT:
      return `/process/department/${id}`
    case ListName.SUB_DEPARTMENT:
      return `/process/subdepartment/${id}`
  }
  console.warn('couldn\'t find object type ' + type)
  return ''
}

const ObjectLinkImpl = (props: RouteComponentProps & ObjectLinkProps) => {
  const [useCss] = useStyletron();
  const linkCss = useCss({textDecoration: 'none'});

  const link =
    props.disable ? props.children :
      <StyledLink onClick={(e: Event) => {
        e.preventDefault();
        (async () => props.history.push(await urlForObject(props.type, props.id, props.audit)))()
      }} href='#' className={props.hideUnderline ? linkCss : undefined}>
        {props.children}
      </StyledLink>

  return props.withHistory ?
    <Block display="flex" justifyContent="space-between" width="100%" alignItems="center">
      {link}
      <AuditButton id={props.id} kind={KIND.tertiary}/>
    </Block> :
    link
}

export const ObjectLink = withRouter(ObjectLinkImpl)
