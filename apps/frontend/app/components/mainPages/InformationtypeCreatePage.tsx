'use client'

import { createInformationType, mapInfoTypeToFormVals } from '@/api/InfoTypeApi'
import { IInformationtypeFormValues } from '@/constants'
import { CodelistContext } from '@/provider/kodeverkProvider'
import { user } from '@/service/User'
import { useNavigate } from '@/util/router'
import { Heading } from '@navikt/ds-react'
import { Fragment, useContext, useMemo, useState } from 'react'
import InformationtypeForm from '../InformationType/InformationtypeForm'
import ErrorNotAllowed from '../common/ErrorNotAllowed'

const InformationtypeCreatePage = () => {
  const { utils: codelistUtils } = useContext(CodelistContext)

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
          <Heading size='large'>Opprett opplysningstype</Heading>
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
