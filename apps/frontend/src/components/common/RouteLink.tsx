import { RouteComponentProps, withRouter } from "react-router-dom";
import { StyledLink } from "baseui/link"
import React from "react"
import { KIND } from "baseui/button"
import { getDisclosure, getPolicy, getProcess } from "../../api"
import { Block } from "baseui/block"
import { AuditButton } from "../audit/AuditButton"
import { AuditItem, ObjectType } from "../../constants"
import { useStyletron } from "baseui"

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
  type: ObjectType
  audit?: AuditItem
  withHistory?: boolean
  children?: any
  disable?: boolean
  hideUnderline?: boolean
}
export const urlForObject = async (type: ObjectType, id: string, audit?: AuditItem) => {
  switch (type) {
    case ObjectType.INFORMATION_TYPE:
      return `/informationtype/${id}`
    case ObjectType.POLICY:
      const policy = await getPolicy(id)
      return `/processActivities/purpose/${policy.purposeCode.code}/${policy.process.id}`
    case ObjectType.PROCESS:
      const process = await getProcess(id)
      return `/processActivities/purpose/${process.purposeCode}/${process.id}`
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
