import axios from 'axios'
import { Notification } from 'baseui/notification'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FormEvent, useState} from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useAllAreas, useProcessSearch } from '../../../api'
import { Process, ProductArea } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { codelist, ListName } from '../../../service/Codelist'
import { env } from '../../../util/env'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { Spinner } from '../../common/Spinner'

import {Button, Checkbox, CheckboxGroup, Heading, Label, Radio, RadioGroup, Select, Textarea} from '@navikt/ds-react'

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

const formatProcessName = (process: Process): string => process.purposes.map((p) => p.shortName).join(', ') + ': ' + process.name

interface IRequestRevisionPageProps {
  close?: () => void
  processId?: string
}

export const RequestRevisionPage = (props: IRequestRevisionPageProps) => {
  const { close, processId } = props
  const navigate: NavigateFunction = useNavigate()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  ampli.logEvent('besøk', { side: 'Admin', url: '/admin/request-revision', app: 'Behandlingskatalogen', type: 'Trenger revidering' })

  const departments = codelist.getParsedOptions(ListName.DEPARTMENT)
  const areas: ProductArea[] = useAllAreas()

  const [processSearchResult, setProcessSearch, processSearchLoading] = useProcessSearch()



  const modalView = !!props.processId

  const abort = (): void => {
    if (close) {
      close()
    } else {
      navigate(-1)
    }
  }
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
  const reset = () => {
    setDone(false)
    setLoading(false)
    setError(undefined)
    setProcessSearch('')
  }

  return (
    <div>
      <Heading level="1" size="large">Send anmodning om revidering</Heading>
      {loading ? <Spinner /> : error && <Notification kind={'negative'}>{error}</Notification>}

      {done ? (
        <div>
          <Notification kind={'positive'}>Revidering etterspurt</Notification>
          <Button variant="secondary" onClick={abort}>
            {modalView ? 'Lukk' : 'Tilbake'}
          </Button>
          {!close && (
            <Button type="button" onClick={reset}>
              Ny revidering
            </Button>
          )}
        </div>
      ) : (
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
              {!modalView && (
                <div className="flex w-full mt-4">
                  <Field name="processSelection">
                    {() => {
                      const button = (s: RecipientType, text: string = 'Alle') => {
                        const onClick = () => formikBag.setFieldValue('processSelection', s)
                        return (
                          <Button onClick={onClick}>
                            {text}
                          </Button>
                        )
                      }
                      return (
                        <div>
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
                        </div>
                      )
                    }}
                  </Field>
                </div>
              )}
              <Error fieldName="processSelection" fullWidth/>

              {!modalView && (
                <>
                <RadioGroup
                  value={formikBag.values.completedOnly}
                  className="flex w-full mt-4"
                  legend="Velg kun fullførte behandlinger"
                  onChange={(value) => formikBag.setFieldValue('completedOnly', value)}
                >
                  <Radio value={true}>Velg kun fullførte behandlinger</Radio>
                  <Radio value={false}>Velg alle behandlinger</Radio>
                </RadioGroup>
</>
              )}

              {formikBag.values.processSelection === RecipientType.ONE && !modalView && (
                <div className="flex w-full mt-4">
                  <ModalLabel label="Behandling" />
{/*
                  <Select
                    noResultsMsg="Ingen"
                    isLoading={processSearchLoading}
                    maxDropdownHeight="400px"
                    searchable={true}
                    type={TYPE.search}
                    options={processSearchResult}
                    placeholder="Søk"
                    value={processSearchResult.filter((process: Process) => process.id === formikBag.values.processId)}
                    onInputChange={(event) => setProcessSearch(event.currentTarget.value)}
                    onChange={(params) => {
                      formikBag.setFieldValue('processId', !params.value[0] ? '' : params.value[0].id)
                    }}
                    filterOptions={(option: Value) => option}
                    labelKey="name"
                    getOptionLabel={({ option }) => formatProcessName(option as Process)}
                  />
*/}



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
                {codelist.getParsedOptions(ListName.DEPARTMENT).map((codeListOption) => (
                  <option key={`option_${codeListOption.id}`} value={codeListOption.label}>
                    {codeListOption.label}
                  </option>
                ))}
              </Select>
              )}
              <Error fieldName="department" fullWidth />

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

              <Error fieldName="productAreaId" fullWidth />

              <div className="flex w-full mt-4">
                  <Textarea
                    name="revisionText"
                    label="Revideringstekst"
                    value={formikBag.values.revisionText}
                    onChange={(event)=>{formikBag.setFieldValue('revisionText', event.target.value)}}
                    minRows={6}
                  />
              </div>
              <div>
                <div className="flex justify-end mt-6">
                  <Button variant="secondary" onClick={()=>formikBag.resetForm()}>
                    Tøm skjema
                  </Button>
                  <Button type="submit">Send</Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}
