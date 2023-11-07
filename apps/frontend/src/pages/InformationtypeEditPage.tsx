import * as React from 'react'

import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import { InformationType, InformationtypeFormValues } from '../constants'
import { codelist } from '../service/Codelist'
import { intl } from '../util'
import { getInformationType, mapInfoTypeToFormVals, updateInformationType } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import { HeadingMedium } from 'baseui/typography'
import { Spinner } from 'baseui/spinner'
import {ampli} from "../service/Amplitude";

const InformationtypeEditPage = () => {
  const [isLoading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [errorSubmit, setErrorSubmit] = React.useState(null)
  const [informationtype, setInformationType] = React.useState<InformationType>()
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  ampli.logEvent("besøk", {side: 'Opplysningstyper', url: '/informationtype/id:/edit', app: 'Behandlingskatalogen', type: 'Rediger opplysningstype'})

  const handleAxiosError = (error: any) => {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else {
      console.log(error.message)
      setError(error.message)
    }
  }

  const handleSubmit = async (values: InformationtypeFormValues) => {
    if (!values) return
    setErrorSubmit(null)
    let body = { ...values }

    try {
      await updateInformationType(body)
      navigate(`/informationtype/${params.id}`)
    } catch (e: any) {
      setErrorSubmit(e.message)
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (params.id) {
          const infoType = await getInformationType(params.id)
          setInformationType(infoType)
        }
      } catch (e: any) {
        handleAxiosError(e)
      }
      await codelist.wait()
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner $size={30} />
      ) : (
        <React.Fragment>
          <HeadingMedium>{intl.edit}</HeadingMedium>

          {!error && informationtype ? (
            <React.Fragment>
              <InformationtypeForm formInitialValues={mapInfoTypeToFormVals(informationtype)} isEdit submit={handleSubmit} />
              {errorSubmit && <p>{errorSubmit}</p>}
            </React.Fragment>
          ) : (
            <p>{intl.couldntLoad}</p>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default InformationtypeEditPage
