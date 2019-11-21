import { useAwait } from "../util/customHooks"
import { user } from "../service/User"
import { Link } from "react-router-dom"
import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDragon } from "@fortawesome/free-solid-svg-icons"
import { intl } from "../util/intl"
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
          <ButtonGroup selected={['no', 'en'].indexOf(intl.getLanguage())}>
            <Button onClick={() => props.setLang('no')}><span role="img" aria-label="norsk flagg">🇳🇴 Norsk</span></Button>
            <Button onClick={() => props.setLang('en')}><span role="img" aria-label="english flagg">🇬🇧 English</span></Button>
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