import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInformationType, mapInfoTypeToFormVals, updateInformationType } from '../api'
import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import { InformationType, InformationtypeFormValues } from '../constants'
import { ampli } from '../service/Amplitude'
import { codelist } from '../service/Codelist'

const InformationtypeEditPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [informationtype, setInformationType] = useState<InformationType>()
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  ampli.logEvent('besøk', { side: 'Opplysningstyper', url: '/informationtype/id:/edit', app: 'Behandlingskatalogen', type: 'Rediger opplysningstype' })

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

  useEffect(() => {
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
    <Fragment>
      {isLoading && <Spinner $size={30} />}{' '}
      {!isLoading && (
        <Fragment>
          <HeadingMedium>Redigér</HeadingMedium>

          {!error && informationtype ? (
            <Fragment>
              <InformationtypeForm formInitialValues={mapInfoTypeToFormVals(informationtype)} isEdit submit={handleSubmit} />
              {errorSubmit && <p>{errorSubmit}</p>}
            </Fragment>
          ) : (
            <p>Kunne ikke laste inn siden</p>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default InformationtypeEditPage
