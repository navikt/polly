import { useAwait } from "../util/customHooks"
import { user } from "../service/User"
import { Link } from "react-router-dom"
import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDragon } from "@fortawesome/free-solid-svg-icons"

const server_polly = process.env.REACT_APP_POLLY_ENDPOINT;

export const Main = () => {
  useAwait(user.wait())

  return (
      <div>
          <div>
            <p> Du er {!user.isLoggedIn() && 'ikke'} logget inn {user.isLoggedIn() ? 'og' : 'men'} kan
              <b> {user.canRead() && 'lese'} {user.canWrite() && 'skrive'} {user.isAdmin() && 'administrere'} </b>
            </p>
            {user.isLoggedIn() &&
            <p>Hei {user.getNavIdent()} {<FontAwesomeIcon icon={faDragon} />} {user.getGivenName()} {user.getFamilyName()} <a href={`${server_polly}/logout?redirect_uri=${window.location.href}`}>logout</a></p>}
            {!user.isLoggedIn() && <p><a href={`${server_polly}/login?redirect_uri=${window.location.href}`}>login</a></p>}
          </div>
          <div>
            <p><Link to="/informationtype">Opplysningstyper</Link></p>
            <p><Link to="/informationtype/create">Ny Opplysningstype</Link></p>
            <p><Link to="/purpose">Formål</Link></p>
          </div>
      </div>
  )
}