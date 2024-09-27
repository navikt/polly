import axios from 'axios'
import { Button as BButton } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import { Combobox } from 'baseui/combobox'
import { Notification } from 'baseui/notification'
import { Select, TYPE, Value } from 'baseui/select'
import { HeadingMedium } from 'baseui/typography'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useAllAreas, useProcessSearch } from '../../../api'
import { IProcess, IProductArea } from '../../../constants'
import { ampli } from '../../../service/Amplitude'
import { EListName, codelist } from '../../../service/Codelist'
import { env } from '../../../util/env'
import { FieldTextarea } from '../../Process/common/FieldTextArea'
import Button from '../../common/Button'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { RadioBoolButton } from '../../common/Radio'
import { Spinner } from '../../common/Spinner'

enum EProcessSelection {
  ONE = 'ONE',
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  PRODUCT_AREA = 'PRODUCT_AREA',
}

interface IProcessRevisionRequest {
  processSelection: EProcessSelection
  processId?: string
  department?: string
  productAreaId?: string
  revisionText: string
  completedOnly: boolean
}

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

const formatProcessName = (process: IProcess): string =>
  process.purposes.map((p) => p.shortName).join(', ') + ': ' + process.name

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

  ampli.logEvent('besøk', {
    side: 'Admin',
    url: '/admin/request-revision',
    app: 'Behandlingskatalogen',
    type: 'Trenger revidering',
  })

  const departments = codelist.getParsedOptions(EListName.DEPARTMENT)
  const areas: IProductArea[] = useAllAreas()

  const [processSearchResult, setProcessSearch, processSearchLoading] = useProcessSearch()

  const modalView = !!props.processId
  const abort = (): void => {
    if (close) {
      close()
    } else {
      navigate(-1)
    }
  }
  const save = async (request: IProcessRevisionRequest) => {
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
      <HeadingMedium>Trenger revidering</HeadingMedium>
      {loading ? <Spinner /> : error && <Notification kind={'negative'}>{error}</Notification>}

      {done ? (
        <div>
          <Notification kind={'positive'}>Revidering etterspurt</Notification>
          <Button type="button" kind="secondary" onClick={abort} marginRight>
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
                  <ModalLabel label="Behandlinger" />
                  <Field name="processSelection">
                    {() => {
                      const button = (s: EProcessSelection, text: string = 'Alle') => {
                        const onClick = () => formikBag.setFieldValue('processSelection', s)
                        return (
                          <BButton type="button" onClick={onClick}>
                            {text}
                          </BButton>
                        )
                      }
                      return (
                        <div>
                          <ButtonGroup
                            selected={Object.values(EProcessSelection).indexOf(
                              formikBag.values.processSelection
                            )}
                          >
                            {button(EProcessSelection.ONE, 'Én')}
                            {button(EProcessSelection.ALL, 'Alle')}
                            {button(EProcessSelection.DEPARTMENT, 'Avdeling')}
                            {button(EProcessSelection.PRODUCT_AREA, 'Område')}
                          </ButtonGroup>
                        </div>
                      )
                    }}
                  </Field>
                </div>
              )}
              <Error fieldName="processSelection" fullWidth />

              {!modalView && (
                <div className="flex w-full mt-4">
                  <ModalLabel label="Bare fullførte" />
                  <Field name="completedOnly">
                    {() => (
                      <RadioBoolButton
                        setValue={(b) => formikBag.setFieldValue('completedOnly', b)}
                        value={formikBag.values.completedOnly}
                        omitUndefined
                      />
                    )}
                  </Field>
                </div>
              )}
              <Error fieldName="completedOnly" fullWidth />

              {formikBag.values.processSelection === EProcessSelection.ONE && !modalView && (
                <div className="flex w-full mt-4">
                  <ModalLabel label="Behandling" />
                  <Select
                    noResultsMsg="Ingen"
                    isLoading={processSearchLoading}
                    maxDropdownHeight="400px"
                    searchable={true}
                    type={TYPE.search}
                    options={processSearchResult}
                    placeholder="Søk"
                    value={processSearchResult.filter(
                      (process: IProcess) => process.id === formikBag.values.processId
                    )}
                    onInputChange={(event) => setProcessSearch(event.currentTarget.value)}
                    onChange={(params) => {
                      formikBag.setFieldValue(
                        'processId',
                        !params.value[0] ? '' : params.value[0].id
                      )
                    }}
                    filterOptions={(option: Value) => option}
                    labelKey="name"
                    getOptionLabel={({ option }) => formatProcessName(option as IProcess)}
                  />
                </div>
              )}
              <Error fieldName="processId" fullWidth />

              {formikBag.values.processSelection === EProcessSelection.DEPARTMENT && (
                <div className="flex w-full mt-4">
                  <ModalLabel label="Avdeling" />
                  <div className="w-full">
                    <Combobox
                      mapOptionToString={(option) => option.label}
                      options={departments}
                      value={formikBag.values.department!}
                      onChange={(code: string) => formikBag.setFieldValue('department', code)}
                    />
                  </div>
                </div>
              )}
              <Error fieldName="department" fullWidth />

              {formikBag.values.processSelection === EProcessSelection.PRODUCT_AREA && (
                <div className="flex w-full mt-4">
                  <ModalLabel label="Område" />
                  <div className="w-full">
                    <Combobox
                      mapOptionToString={(option: IProductArea) => option.name}
                      options={areas}
                      value={formikBag.values.productAreaId!}
                      onChange={(code: string) => formikBag.setFieldValue('productAreaId', code)}
                    />
                  </div>
                </div>
              )}
              <Error fieldName="productAreaId" fullWidth />

              <div className="flex w-full mt-4">
                <ModalLabel label="Revideringstekst" />
                <FieldTextarea fieldName="revisionText" placeHolder="Revideringstekst" rows={6} />
              </div>
              <Error fieldName="revisionText" fullWidth />

              <div>
                <div className="flex justify-end mt-6">
                  <Button type="button" kind="secondary" onClick={abort} marginRight>
                    Avbryt
                  </Button>
                  <Button type="submit">Lagre</Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}
