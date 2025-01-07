import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getInformationType, mapInfoTypeToFormVals, updateInformationType } from '../api/GetAllApi'
import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import { IInformationType, IInformationtypeFormValues } from '../constants'
import { ampli } from '../service/Amplitude'

const InformationtypeEditPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [informationtype, setInformationType] = useState<IInformationType>()
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  ampli.logEvent('besøk', {
    side: 'Opplysningstyper',
    url: '/informationtype/id:/edit',
    app: 'Behandlingskatalogen',
    type: 'Rediger opplysningstype',
  })

  const handleAxiosError = (error: any) => {
    if (error.response) {
      console.debug(error.response.data)
      console.debug(error.response.status)
      console.debug(error.response.headers)
    } else {
      console.debug(error.message)
      setError(error.message)
    }
  }

  const handleSubmit = async (values: IInformationtypeFormValues) => {
    if (!values) return
    setErrorSubmit(null)
    const body = { ...values }

    try {
      await updateInformationType(body)
      navigate(`/informationtype/${params.id}`)
    } catch (error: any) {
      setErrorSubmit(error.message)
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
      } catch (error: any) {
        handleAxiosError(error)
      }
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
              <InformationtypeForm
                formInitialValues={mapInfoTypeToFormVals(informationtype)}
                isEdit
                submit={handleSubmit}
              />
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
