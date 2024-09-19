import axios from 'axios'
import {Form, Formik} from 'formik'
import {useState} from 'react'
import * as yup from 'yup'
import { env } from '../../../util/env'

import {Button, Heading, Textarea} from '@navikt/ds-react'
import {ProcessRevisionRequest, RecipientType} from "../../../constants";

const initialValues: ProcessRevisionRequest = {
  processSelection: RecipientType.ONE,
  processId: '',
  department: '',
  productAreaId: '',
  revisionText: '',
  completedOnly: false,
}

const schema: () => yup.ObjectSchema<ProcessRevisionRequest> = () => {
  const requiredString = yup.string().required('Feltet er påkrevd')
  return yup.object({
    processSelection: yup.mixed<RecipientType>().oneOf(Object.values(RecipientType)).required(),
    processId: yup.string().when('processSelection', { is: RecipientType.ONE, then: () => requiredString }),
    department: yup.string().when('processSelection', { is: RecipientType.DEPARTMENT, then: () => requiredString }),
    productAreaId: yup.string().when('processSelection', { is: RecipientType.PRODUCT_AREA, then: () => requiredString }),
    revisionText: requiredString,
    completedOnly: yup.boolean().required(),
  })
}

const requestRevision = async (request: ProcessRevisionRequest) => {
  await axios.post(`${env.pollyBaseUrl}/process/revision`, request)
}

interface IRequestRevisionPageProps {
  close: () => void
  processId?: string
}

export const RequestRevisionModal = (props: IRequestRevisionPageProps) => {
  const { close, processId } = props
  const [error, setError] = useState()

  const save = async (request: ProcessRevisionRequest) => {
    try {
      await requestRevision(request)
    } catch (error: any) {
      setError(error.message)
    }
    close()
  }

  return (
    <div>
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
              <Heading level="1" size="large">Send anmodning om  revidering</Heading>
                <Textarea
                  className="w-full mt-4"
                  name="revisionText"
                  label="Revideringstekst"
                  value={formikBag.values.revisionText}
                  onChange={(event)=>{formikBag.setFieldValue('revisionText', event.target.value)}}
                  minRows={6}
                  error={formikBag.errors.revisionText}
                />
                <div className="flex justify-end mt-6 gap-4">
                  <Button variant="secondary" onClick={close}>
                    Avbryt
                  </Button>
                  <Button type="submit">Send</Button>
                </div>
            </Form>
          )}
        </Formik>
    </div>
  )
}
