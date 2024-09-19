import axios from 'axios'
import {Field, Form, Formik} from 'formik'
import {useState} from 'react'
import * as yup from 'yup'
import {searchProcessOptions, useAllAreas} from '../../../api'
import { ProductArea } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { codelist, ListName } from '../../../service/Codelist'
import { env } from '../../../util/env'
import { Error } from '../../common/ModalSchema'
import AsyncSelect from 'react-select/async'

import {Alert, Button, Heading, Label, Loader, Radio, RadioGroup, Select, Textarea} from '@navikt/ds-react'

enum RecipientType {
  ONE = 'ONE',
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  PRODUCT_AREA = 'PRODUCT_AREA',
}

interface ProcessRevisionRequest {
  processSelection: RecipientType
  processId?: string
  department?: string
  productAreaId?: string
  revisionText: string
  completedOnly: boolean
}

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
  close?: () => void
  processId?: string
}

export const RequestRevisionPage = (props: IRequestRevisionPageProps) => {
  const { processId } = props
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  ampli.logEvent('besøk', { side: 'Admin', url: '/admin/request-revision', app: 'Behandlingskatalogen', type: 'Trenger revidering' })

  const departments = codelist.getParsedOptions(ListName.DEPARTMENT)
  const areas: ProductArea[] = useAllAreas()

  const save = async (request: ProcessRevisionRequest) => {
    setLoading(true)
    try {
      await requestRevision(request)
      setDone(true)
    } catch (error: any) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <Heading level="1" size="large">Send anmodning om revidering</Heading>

      {loading ? <Loader size="xlarge" /> : error && <Alert variant={'error'}>{error}</Alert>}

        <Formik
          initialValues={{
            ...initialValues,
            processId: processId || '',
          }}
          validationSchema={schema()}
          onSubmit={save}
          validateOnBlur={true}
        >
          {(formikBag) => (
            <Form>
              {done &&
                <div>
                  <Alert variant="success">Revidering etterspurt</Alert>
                </div>
              }

                <div className="flex w-full mt-4">
                  <Field name="processSelection">
                    {() => {
                      return (
                          <div className="min-w-fit">
                            <RadioGroup
                              value={formikBag.values.processSelection}
                              legend="Velg omfang"
                              onChange={(val) => formikBag.setFieldValue('processSelection', val)}
                              name='processSelection'
                            >
                              <Radio value={RecipientType.ONE}>Én behandling</Radio>
                              <Radio value={RecipientType.ALL}>Alle</Radio>
                              <Radio value={RecipientType.DEPARTMENT}>Avdeling</Radio>
                              <Radio value={RecipientType.PRODUCT_AREA}>Område</Radio>
                            </RadioGroup>
                          </div>
                      )
                    }}
                  </Field>
                </div>
              <Error fieldName="processSelection" fullWidth/>

              {formikBag.values.processSelection !== RecipientType.ONE && (
                <RadioGroup
                  value={formikBag.values.completedOnly}
                  className="flex w-full mt-4"
                  legend="Velg kun fullførte behandlinger"
                  onChange={(value) => formikBag.setFieldValue('completedOnly', value)}
                >
                  <Radio value={true}>Velg kun fullførte behandlinger</Radio>
                  <Radio value={false}>Velg alle behandlinger</Radio>
                </RadioGroup>
              )}

              {formikBag.values.processSelection === RecipientType.ONE && (
                <div className="flex w-full mt-4 my-3">
                        <div className="my-3">
                          <Label>Legg til  en behandling fra Behandlingskatalogen</Label>

                            <AsyncSelect
                              aria-label="Søk etter behandlinger"
                              placeholder=""
                              noOptionsMessage={()=>'Skriv minst 3 tegn for å søke'}
                              loadingMessage={() => 'Søker...'}
                              isClearable={false}
                              loadOptions={searchProcessOptions}
                              onChange={(val) => {
                                if (val) {
                                  formikBag.setFieldValue('processId', val.value)
                                }
                              }}
                            />
                          </div>
                </div>
              )}
              <Error fieldName="processId" fullWidth />


              {formikBag.values.processSelection === RecipientType.DEPARTMENT && (
              <Select
                className="w-1/2"
                label="Avdeling"
                onChange={(ev) => formikBag.setFieldValue('department', ev.currentTarget.value)}
                value={formikBag.values.department!}
              >
                <option key="" value="">
                  Velg avdeling
                </option>
                {departments.map((codeListOption) => (
                  <option key={`option_${codeListOption.id}`} value={codeListOption.label}>
                    {codeListOption.label}
                  </option>
                ))}
              </Select>
              )}

              {formikBag.values.processSelection === RecipientType.PRODUCT_AREA && (
              <Select
                className="w-1/2"
                label="Område"
                onChange={(ev) => formikBag.setFieldValue('productAreaId', ev.currentTarget.value)}
                value={formikBag.values.productAreaId!}
              >
                <option key="" value="">
                  Velg område
                </option>
                {areas.map((productArea) => (
                  <option key={`option_${productArea.id}`} value={productArea.name}>
                    {productArea.name}
                  </option>
                ))}
              </Select>
                )}

              <div className="flex mt-4">
                  <Textarea
                    className="w-1/2"
                    name="revisionText"
                    label="Revideringstekst"
                    value={formikBag.values.revisionText}
                    onChange={(event)=>{formikBag.setFieldValue('revisionText', event.target.value)}}
                    minRows={6}
                  />
              </div>
                <div className="flex justify-end mt-6 gap-2">
                  <Button variant="secondary" type="reset" onClick={()=> {
                    setDone(false)
                    formikBag.resetForm()}
                  }>
                    Tøm skjema
                  </Button>
                  <Button type="submit">Send</Button>
                </div>
            </Form>
          )}
        </Formik>
    </div>
  )
}
