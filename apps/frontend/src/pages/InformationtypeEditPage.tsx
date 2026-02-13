import { Heading, Loader } from '@navikt/ds-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getInformationType, mapInfoTypeToFormVals, updateInformationType } from '../api/GetAllApi'
import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import { IInformationType, IInformationtypeFormValues } from '../constants'

const InformationtypeEditPage = () => {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [informationtype, setInformationType] = useState<IInformationType>()
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

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

  const initialValues = useMemo(
    () => (informationtype ? mapInfoTypeToFormVals(informationtype) : mapInfoTypeToFormVals({})),
    [informationtype]
  )

  return (
    <Fragment>
      {isLoading && <Loader size="medium" />}{' '}
      {!isLoading && (
        <Fragment>
          <Heading size="large">Redigér</Heading>

          {!error && informationtype ? (
            <Fragment>
              <InformationtypeForm formInitialValues={initialValues} isEdit submit={handleSubmit} />
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
