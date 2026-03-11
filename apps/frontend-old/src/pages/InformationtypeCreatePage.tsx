import { Heading } from '@navikt/ds-react'
import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { createInformationType, mapInfoTypeToFormVals } from '../api/GetAllApi'
import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import ErrorNotAllowed from '../components/common/ErrorNotAllowed'
import { IInformationtypeFormValues } from '../constants'
import { CodelistService } from '../service/Codelist'
import { user } from '../service/User'

const InformationtypeCreatePage = () => {
  const [codelistUtils] = CodelistService()

  const initialValues = useMemo(() => mapInfoTypeToFormVals({}), [])

  const [errorSubmit, setErrorSubmit] = useState(null)
  const navigate = useNavigate()

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

  return (
    <Fragment>
      {!hasAccess() && <ErrorNotAllowed />}
      {hasAccess() && (
        <>
          <Heading size="large">Opprett opplysningstype</Heading>
          {codelistUtils && (
            <>
              <InformationtypeForm
                formInitialValues={initialValues}
                submit={handleSubmit}
                isEdit={false}
              />
              {errorSubmit && <p>{errorSubmit}</p>}
            </>
          )}
          {!codelistUtils && <p>Feil i henting av codelist</p>}
        </>
      )}
    </Fragment>
  )
}

export default InformationtypeCreatePage
