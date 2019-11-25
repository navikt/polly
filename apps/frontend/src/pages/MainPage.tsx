import { useAwait } from "../util/customHooks"
import { user } from "../service/User"
import { Link } from "react-router-dom"
import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDragon } from "@fortawesome/free-solid-svg-icons"
import { intl, langs } from "../util/intl/intl"
import { Button } from "baseui/button"
import { Block } from "baseui/block"
import { ButtonGroup } from "baseui/button-group"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const Main = (props: { setLang: (lang: string) => void }) => {
    useAwait(user.wait())

    return (
        <Block display="flex">
            <Block width="40%">
                <p>{user.isLoggedIn() ? intl.loggedInStatus : intl.notLoggedInStatus}
                    <b> {user.canRead() && intl.read} {user.canWrite() && intl.write} {user.isAdmin() && intl.administrate} </b>
                </p>
                {user.isLoggedIn() &&
                <p>{intl.hi} {user.getNavIdent()} {<FontAwesomeIcon icon={faDragon}/>} {user.getGivenName()} {user.getFamilyName()} <a
                    href={`${server_polly}/logout?redirect_uri=${window.location.href}`}>{intl.logout}</a></p>}
                {!user.isLoggedIn() && <p><a href={`${server_polly}/login?redirect_uri=${window.location.href}`}>{intl.login}</a></p>}
                <ButtonGroup selected={intl.getAvailableLanguages().indexOf(intl.getLanguage())}>
                    {intl.getAvailableLanguages().map(lang =>
                        <Button onClick={() => props.setLang(lang)}><span role="img" aria-label={langs[lang].name}>{langs[lang].flag} {langs[lang].name}</span></Button>
                    )}
                </ButtonGroup>
            </Block>
            <Block>
                <p><Link to="/informationtype">{intl.informationTypes}</Link></p>
                <p><Link to="/informationtype/create">{intl.createNew} {intl.informationType}</Link></p>
                <p><Link to="/purpose">{intl.purpose}</Link></p>
            </Block>
        </Block>
    )
}