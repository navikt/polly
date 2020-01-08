import { RouteComponentProps, withRouter } from "react-router-dom";
import { StyledLink } from "baseui/link"
import React from "react"
import { KIND } from "baseui/button"
import { AuditButton } from "../../pages/AuditPage"
import { getDisclosure, getPolicy, getProcess } from "../../api"
import { Block } from "baseui/block"

type RouteLinkProps = {
    href: string
}

const RouteLinkImpl = (props: RouteComponentProps & RouteLinkProps & any) => {
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
    id: string,
    type: ObjectType,
    withHistory?: boolean,
    children?: any
}

export enum ObjectType {
    INFORMATION_TYPE,
    POLICY,
    PROCESS,
    DISCLOSURE
}

const ObjectLinkImpl = (props: RouteComponentProps & ObjectLinkProps) => {
    const urlFor = async (type: ObjectType, id: string) => {
        switch (type) {
            case ObjectType.INFORMATION_TYPE:
                return `/informationtype/${id}`
            case ObjectType.POLICY:
                const policy = await getPolicy(id)
                return `/purpose/${policy.purposeCode.code}/${policy.process.id}`
            case ObjectType.PROCESS:
                const process = await getProcess(id)
                return `/purpose/${process.purposeCode}/${process.id}`
            case ObjectType.DISCLOSURE:
                const disclosure = await getDisclosure(id)
                return `/thirdparty/${disclosure.recipient.code}`
        }
        console.warn('couldn\'t find object type ' + type)
        return ''
    }

    const link =
        <StyledLink onClick={(e: Event) => {
            e.preventDefault();
            (async () => props.history.push(await urlFor(props.type, props.id)))()
        }} href='#'>
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
