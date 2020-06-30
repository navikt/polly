import * as React from 'react'

import InformationtypeForm from '../components/InformationType/InformationtypeForm'
import {codelist} from '../service/Codelist'
import {InformationtypeFormValues} from '../constants'
import {intl, useAwait} from '../util'
import {user} from '../service/User'
import ErrorNotAllowed from '../components/common/ErrorNotAllowed'
import {createInformationType, mapInfoTypeToFormVals} from '../api'
import {RouteComponentProps} from 'react-router-dom'
import {H4} from 'baseui/typography'
import {StyledSpinnerNext} from 'baseui/spinner'

const InformationtypeCreatePage = (props: RouteComponentProps) => {
  const [isLoading, setLoading] = React.useState(true)
  const [errorSubmit, setErrorSubmit] = React.useState(null)

  const handleSubmit = async (values: InformationtypeFormValues) => {
    if (!values) return

    setErrorSubmit(null)
    try {
      const infoType = await createInformationType(values)
      props.history.push(`/informationtype/${infoType.id}`)
    } catch (err) {
      setErrorSubmit(err.message)
    }
  }

  const hasAccess = () => user.canWrite()

  useAwait(codelist.wait(), setLoading)

  return (
    <React.Fragment>
      {!hasAccess() ? (<ErrorNotAllowed/>)
        : (
          <>
            {isLoading ? (
              <StyledSpinnerNext size={30}/>
            ) : (
              <>
                <H4>{intl.informationTypeCreate}</H4>
                {codelist ? (
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
        )
      }
    </React.Fragment>
  )
}

export default InformationtypeCreatePage
