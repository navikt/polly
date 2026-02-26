import { Alert, Button, Heading, Loader, Textarea } from '@navikt/ds-react'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import * as yup from 'yup'
import { EProcessSelection, IProcessRevisionRequest } from '../../../constants'
import { env } from '../../../util/env'

const initialValues: IProcessRevisionRequest = {
  processSelection: EProcessSelection.ONE,
  processId: '',
  department: '',
  productAreaId: '',
  revisionText: '',
  completedOnly: false,
}

const schema: () => yup.ObjectSchema<IProcessRevisionRequest> = () => {
  const requiredString = yup.string().required('Feltet er påkrevd')
  return yup.object({
    processSelection: yup
      .mixed<EProcessSelection>()
      .oneOf(Object.values(EProcessSelection))
      .required(),
    processId: yup
      .string()
      .when('processSelection', { is: EProcessSelection.ONE, then: () => requiredString }),
    department: yup
      .string()
      .when('processSelection', { is: EProcessSelection.DEPARTMENT, then: () => requiredString }),
    productAreaId: yup
      .string()
      .when('processSelection', { is: EProcessSelection.PRODUCT_AREA, then: () => requiredString }),
    revisionText: requiredString,
    completedOnly: yup.boolean().required(),
  })
}

const requestRevision = async (request: IProcessRevisionRequest) => {
  await axios.post(`${env.pollyBaseUrl}/process/revision`, request)
}

interface IRequestRevisionPageProps {
  close: () => void
  processId?: string
}

export const RequestRevisionForm = (props: IRequestRevisionPageProps) => {
  const { close, processId } = props

  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const getErrorMessage = (err: any): string => {
    const responseData = err?.response?.data

    if (typeof responseData === 'string' && responseData.trim().length > 0) {
      return responseData
    }

    const responseMessage = responseData?.message
    if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
      return responseMessage
    }

    if (typeof err?.message === 'string' && err.message.trim().length > 0) {
      return err.message
    }

    return 'Kunne ikke sende anmodning om revidering.'
  }

  const save = async (request: IProcessRevisionRequest) => {
    setLoading(true)
    setError(undefined)
    setDone(false)
    try {
      await requestRevision(request)
      setDone(true)
    } catch (err: any) {
      console.debug(err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading && (
        <div className="flex w-full justify-center">
          <Loader size="3xlarge" />
        </div>
      )}

      {error && <Alert variant={'error'}>{error}</Alert>}

      <Formik
        initialValues={{
          ...initialValues,
          processId: processId || '',
        }}
        validationSchema={schema()}
        onSubmit={save}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(formikBag) => (
          <Form>
            <Heading level="1" size="large">
              Send anmodning om revidering
            </Heading>

            {done && (
              <div className="mt-4">
                <Alert variant="success">Revidering etterspurt</Alert>
              </div>
            )}

            <Textarea
              className="w-full mt-4"
              name="revisionText"
              label="Revideringstekst"
              value={formikBag.values.revisionText}
              onChange={(event) => {
                formikBag.setFieldValue('revisionText', event.target.value)
              }}
              minRows={6}
              error={formikBag.errors.revisionText}
              disabled={loading || done}
            />
            <div className="flex justify-end mt-6 gap-4">
              {done ? (
                <Button type="button" onClick={close}>
                  Lukk
                </Button>
              ) : (
                <>
                  <Button type="button" variant="secondary" onClick={close}>
                    Avbryt
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Send
                  </Button>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
