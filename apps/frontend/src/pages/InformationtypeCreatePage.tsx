import { Spinner } from 'baseui/spinner'
import { HeadingMedium } from 'baseui/typography'
import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createInformationType, mapInfoTypeToFormVals } from '../api/GetAllApi'
import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import ErrorNotAllowed from '../components/common/ErrorNotAllowed'
import { IInformationtypeFormValues } from '../constants'
import { ampli } from '../service/Amplitude'
import { CodelistService } from '../service/Codelist'
import { user } from '../service/User'

const InformationtypeCreatePage = () => {
  const [codelistUtils] = CodelistService()

  const [isLoading, setLoading] = useState(true)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const navigate = useNavigate()

  ampli.logEvent('besøk', {
    side: 'Opplysningstyper',
    url: '/informationtype/create',
    app: 'Behandlingskatalogen',
    type: 'Opprett opplysningstype',
  })

  const handleSubmit = async (values: IInformationtypeFormValues) => {
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

  // useAwait(codelistUtils.fetchData(), setLoading)

  isLoading ? setLoading(true) : setLoading(false)

  return (
    <Fragment>
      {!hasAccess() ? (
        <ErrorNotAllowed />
      ) : (
        <>
          {isLoading ? (
            <Spinner $size={30} />
          ) : (
            <>
              <HeadingMedium>Opprett opplysningstype</HeadingMedium>
              {codelistUtils ? (
                <>
                  <InformationtypeForm
                    formInitialValues={mapInfoTypeToFormVals({})}
                    submit={handleSubmit}
                    isEdit={false}
                  />
                  {errorSubmit && <p>{errorSubmit}</p>}
                </>
              ) : (
                <p>Feil i henting av codelist</p>
              )}
            </>
          )}
        </>
      )}
    </Fragment>
  )
}

export default InformationtypeCreatePage
