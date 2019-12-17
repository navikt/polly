import { RouteComponentProps, withRouter } from "react-router-dom";
import { StyledLink } from "baseui/link"
import React from "react"

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