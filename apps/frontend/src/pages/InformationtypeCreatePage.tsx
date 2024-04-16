import * as React from 'react'

import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import { codelist } from '../service/Codelist'
import { InformationtypeFormValues } from '../constants'
import { useAwait } from '../util'
import { user } from '../service/User'
import ErrorNotAllowed from '../components/common/ErrorNotAllowed'
import { createInformationType, mapInfoTypeToFormVals } from '../api'
import { useNavigate } from 'react-router-dom'
import { HeadingMedium } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'
import {ampli} from "../service/Amplitude";

const InformationtypeCreatePage = () => {
  const [isLoading, setLoading] = React.useState(true)
  const [errorSubmit, setErrorSubmit] = React.useState(null)
  const navigate = useNavigate()

  ampli.logEvent("besøk", {side: 'Opplysningstyper', url: '/informationtype/create', app: 'Behandlingskatalogen', type: 'Opprett opplysningstype'})

  const handleSubmit = async (values: InformationtypeFormValues) => {
    if (!values) return

    setErrorSubmit(null)
    try {
      const infoType = await createInformationType(values)
      navigate(`/informationtype/${infoType.id}`)
    } catch (err: any) {
      setErrorSubmit(err.message)
    }
  }

  const hasAccess = () => user.canWrite()

  useAwait(codelist.wait(), setLoading)

  return (
    <React.Fragment>
      {!hasAccess() ? (
        <ErrorNotAllowed />
      ) : (
        <>
          {isLoading ? (
            <Spinner $size={30} />
          ) : (
            <>
              <HeadingMedium>Opprett opplysningstype</HeadingMedium>
              {codelist ? (
                <>
                  <InformationtypeForm formInitialValues={mapInfoTypeToFormVals({})} submit={handleSubmit} isEdit={false} />
                  {errorSubmit && <p>{errorSubmit}</p>}
                </>
              ) : (
                <p>Feil i henting av codelist</p>
              )}
            </>
          )}
        </>
      )}
    </React.Fragment>
  )
}

export default InformationtypeCreatePage
