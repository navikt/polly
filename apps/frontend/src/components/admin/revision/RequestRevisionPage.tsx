import axios from 'axios'
import { Form, Formik} from 'formik'
import {useState} from 'react'
import * as yup from 'yup'
import {searchProcessOptions, useAllAreas} from '../../../api'
import {ProcessRevisionRequest, ProductArea, RecipientType} from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { codelist, ListName } from '../../../service/Codelist'
import { env } from '../../../util/env'
import { Error } from '../../common/ModalSchema'
import AsyncSelect from 'react-select/async'

import {Alert, Button, Heading, Label, Loader, Radio, RadioGroup, Select, Tabs, Textarea} from '@navikt/ds-react'

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

  const reset = ()=> {
      setDone(false)
      setError(undefined)
  }

  const selectOnlyCompleted = (formikBag: any)=> {
    return (
      <RadioGroup
        value={formikBag.values.completedOnly}
        className="flex w-full mt-4"
        legend="Velg kun fullførte behandlinger"
        onChange={(value) => formikBag.setFieldValue('completedOnly', value)}
        error={formikBag.errors.completedOnly}
      >
        <Radio value={true}>Velg kun fullførte behandlinger</Radio>
        <Radio value={false}>Velg alle behandlinger</Radio>
      </RadioGroup>)
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
          onReset={reset}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {(formikBag) => (
            <Form>
              {done &&
                <div>
                  <Alert variant="success">Revidering etterspurt</Alert>
                </div>
              }
                <div className="flex w-full mt-4">
                </div>

              <Tabs defaultValue="logg" value={formikBag.values.processSelection} onChange={(value)=>formikBag.setFieldValue('processSelection', value)}>
                <Tabs.List>
                  <Tabs.Tab
                    value={RecipientType.ONE}
                    label="Én behandling"
                  />
                  <Tabs.Tab
                    value={RecipientType.ALL}
                    label="Alle behandlinger"
                  />
                  <Tabs.Tab
                    value={RecipientType.DEPARTMENT}
                    label="Avdeling"
                  />
                  <Tabs.Tab
                    value={RecipientType.PRODUCT_AREA}
                    label="Område"
                  />
                </Tabs.List>
                <Tabs.Panel value={RecipientType.ONE} className="h-48 w-full p-4">
                  <div className="flex w-full mt-4 my-3">
                    <div className="my-3">
                      <Label>Legg til en behandling fra Behandlingskatalogen</Label>

                      <AsyncSelect
                        aria-label="Søk etter behandlinger"
                        placeholder=""
                        noOptionsMessage={() => 'Skriv minst 3 tegn for å søke'}
                        loadingMessage={() => 'Søker...'}
                        isClearable={true}
                        loadOptions={searchProcessOptions}
                        onChange={(val) => {
                          if (val) {
                            formikBag.setFieldValue('processId', val.value)
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Error fieldName="processId" fullWidth />
                </Tabs.Panel>
                <Tabs.Panel value={RecipientType.ALL} className="h-48 w-full p-4">
                  {selectOnlyCompleted(formikBag)}
                </Tabs.Panel>
                <Tabs.Panel value={RecipientType.DEPARTMENT} className="h-68 w-full p-4">
                  <Select
                    className="w-1/2"
                    label="Avdeling"
                    hideLabel
                    onChange={(ev) => formikBag.setFieldValue('department', ev.currentTarget.value)}
                    value={formikBag.values.department!}
                    error={formikBag.errors.department}
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
                  {selectOnlyCompleted(formikBag)}
                </Tabs.Panel>
                <Tabs.Panel value={RecipientType.PRODUCT_AREA} className="h-68 w-full p-4">
                  <Select
                    className="w-1/2"
                    label="Område"
                    hideLabel
                    onChange={(ev) => formikBag.setFieldValue('productAreaId', ev.currentTarget.value)}
                    value={formikBag.values.productAreaId!}
                    error={formikBag.errors.productAreaId}
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
                  {selectOnlyCompleted(formikBag)}
                </Tabs.Panel>
              </Tabs>

              <div className="flex mt-4 ml-4">
                  <Textarea
                    className="w-1/2"
                    name="revisionText"
                    label="Revideringstekst"
                    value={formikBag.values.revisionText}
                    onChange={(event)=>{formikBag.setFieldValue('revisionText', event.target.value)}}
                    error={formikBag.errors.revisionText}
                    minRows={6}
                  />
              </div>

                <div className="flex justify-end mt-6 gap-2">
                  <Button variant="secondary" type="reset" >
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
