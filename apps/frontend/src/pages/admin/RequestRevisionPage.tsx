import React, { useState } from 'react'
import { Block, BlockProps } from 'baseui/block'
import { HeadingMedium } from 'baseui/typography'
import { intl, theme } from '../../util'
import { Spinner } from '../../components/common/Spinner'
import { useNavigate } from 'react-router-dom'
import { codelist, ListName } from '../../service/Codelist'
import { useAllAreas, useProcessSearch } from '../../api'
import axios from 'axios'
import { env } from '../../util/env'
import * as yup from 'yup'
import { Field, Form, Formik, FormikProps } from 'formik'
import { Error, ModalLabel } from '../../components/common/ModalSchema'
import { ButtonGroup } from 'baseui/button-group'
import { Button as BButton } from 'baseui/button'
import Button from '../../components/common/Button'
import { RadioBoolButton } from '../../components/common/Radio'
import { Select, TYPE } from 'baseui/select'
import { Process } from '../../constants'
import { Combobox } from 'baseui/combobox'
import { Notification } from 'baseui/notification'
import { FieldTextarea } from '../../components/Process/common/FieldTextArea'
import {ampli} from "../../service/Amplitude";

enum ProcessSelection {
  ONE = 'ONE',
  ALL = 'ALL',
  DEPARTMENT = 'DEPARTMENT',
  PRODUCT_AREA = 'PRODUCT_AREA',
}

interface ProcessRevisionRequest {
  processSelection: ProcessSelection
  processId?: string
  department?: string
  productAreaId?: string
  revisionText: string
  completedOnly: boolean
}

const initialValues: ProcessRevisionRequest = {
  processSelection: ProcessSelection.ONE,
  processId: '',
  department: '',
  productAreaId: '',
  revisionText: '',
  completedOnly: false,
}

const schema: () => yup.ObjectSchema<ProcessRevisionRequest> = () => {
  const requiredString = yup.string().required(intl.required)
  return yup.object({
    processSelection: yup.mixed<ProcessSelection>().oneOf(Object.values(ProcessSelection)).required(),
    processId: yup.string().when('processSelection', { is: ProcessSelection.ONE, then: () => requiredString }),
    department: yup.string().when('processSelection', { is: ProcessSelection.DEPARTMENT, then: () => requiredString }),
    productAreaId: yup.string().when('processSelection', { is: ProcessSelection.PRODUCT_AREA, then: () => requiredString }),
    revisionText: requiredString,
    completedOnly: yup.boolean().required(),
  })
}

const requestRevision = async (request: ProcessRevisionRequest) => {
  await axios.post(`${env.pollyBaseUrl}/process/revision`, request)
}
const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const formatProcessName = (process: Process) => process.purposes.map((p) => p.shortName).join(', ') + ': ' + process.name

export const RequestRevisionPage = (props: { close?: () => void; processId?: string }) => {
  const navigate = useNavigate()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  ampli.logEvent("besøk", {side: 'Admin', url: '/admin/request-revision', app: 'Behandlingskatalogen', type:  'Trenger revidering'})

  const departments = codelist.getParsedOptions(ListName.DEPARTMENT)
  const areas = useAllAreas()

  const [processSearchResult, setProcessSearch, processSearchLoading] = useProcessSearch()

  const modalView = !!props.processId
  const abort = () => {
    if (props.close) {
      props.close()
    } else {
      navigate(-1)
    }
  }
  const save = async (request: ProcessRevisionRequest) => {
    setLoading(true)
    try {
      await requestRevision(request)
      setDone(true)
    } catch (e: any) {
      setError(e.message)
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
    <Block>
      <HeadingMedium>{intl.needsRevision}</HeadingMedium>
      {loading ? <Spinner /> : error && <Notification kind={'negative'}>{error}</Notification>}

      {done ? (
        <Block>
          <Notification kind={'positive'}>{intl.revisionCreated}</Notification>
          <Button type="button" kind="secondary" onClick={abort} marginRight>
            {modalView ? intl.close : intl.back}
          </Button>
          {!props.close && (
            <Button type="button" onClick={reset}>
              {intl.newRevision}
            </Button>
          )}
        </Block>
      ) : (
        <Formik
          initialValues={{
            ...initialValues,
            processId: props.processId || '',
          }}
          validationSchema={schema()}
          onSubmit={save}
          validateOnBlur={true}
        >
          {(formikBag) => (
            <Form>
              {!modalView && (
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.processes} />
                  <Field name="processSelection">
                    {() => {
                      const button = (s: ProcessSelection, text: string = intl.all) => {
                        const onClick = () => formikBag.setFieldValue('processSelection', s)
                        return (
                          <BButton type="button" onClick={onClick}>
                            {text}
                          </BButton>
                        )
                      }
                      return (
                        <Block>
                          <ButtonGroup selected={Object.values(ProcessSelection).indexOf(formikBag.values.processSelection)}>
                            {button(ProcessSelection.ONE, intl.one)}
                            {button(ProcessSelection.ALL, intl.all)}
                            {button(ProcessSelection.DEPARTMENT, intl.department)}
                            {button(ProcessSelection.PRODUCT_AREA, intl.productArea)}
                          </ButtonGroup>
                        </Block>
                      )
                    }}
                  </Field>
                </Block>
              )}
              <Error fieldName="processSelection" fullWidth />

              {!modalView && (
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.completedOnly} />
                  <Field name="completedOnly">
                    {() => <RadioBoolButton setValue={(b) => formikBag.setFieldValue('completedOnly', b)} value={formikBag.values.completedOnly} omitUndefined />}
                  </Field>
                </Block>
              )}
              <Error fieldName="completedOnly" fullWidth />

              {formikBag.values.processSelection === ProcessSelection.ONE && !modalView && (
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.process} />
                  <Select
                    noResultsMsg={intl.emptyTable}
                    isLoading={processSearchLoading}
                    maxDropdownHeight="400px"
                    searchable={true}
                    type={TYPE.search}
                    options={processSearchResult}
                    placeholder={intl.search}
                    value={processSearchResult.filter((r) => r.id === formikBag.values.processId)}
                    onInputChange={(event) => setProcessSearch(event.currentTarget.value)}
                    onChange={(params) => {
                      formikBag.setFieldValue('processId', !params.value[0] ? '' : params.value[0].id)
                    }}
                    filterOptions={(o) => o}
                    labelKey="name"
                    getOptionLabel={({ option }) => formatProcessName(option as Process)}
                  />
                </Block>
              )}
              <Error fieldName="processId" fullWidth />

              {formikBag.values.processSelection === ProcessSelection.DEPARTMENT && (
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.department} />
                  <Block width="100%">
                    <Combobox
                      mapOptionToString={(o) => o.label}
                      options={departments}
                      value={formikBag.values.department!}
                      onChange={(code) => formikBag.setFieldValue('department', code)}
                    />
                  </Block>
                </Block>
              )}
              <Error fieldName="department" fullWidth />

              {formikBag.values.processSelection === ProcessSelection.PRODUCT_AREA && (
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.productArea} />
                  <Block width="100%">
                    <Combobox
                      mapOptionToString={(o) => o.name}
                      options={areas}
                      value={formikBag.values.productAreaId!}
                      onChange={(code) => formikBag.setFieldValue('productAreaId', code)}
                    />
                  </Block>
                </Block>
              )}
              <Error fieldName="productAreaId" fullWidth />

              <Block {...rowBlockProps}>
                <ModalLabel label={intl.revisionText} />
                <FieldTextarea fieldName="revisionText" placeHolder={intl.revisionText} rows={6} />
              </Block>
              <Error fieldName="revisionText" fullWidth />

              <Block>
                <Block display="flex" justifyContent="flex-end" marginTop={theme.sizing.scale800}>
                  <Button type="button" kind="secondary" onClick={abort} marginRight>
                    {intl.abort}
                  </Button>
                  <Button type="submit">{intl.save}</Button>
                </Block>
              </Block>
            </Form>
          )}
        </Formik>
      )}
    </Block>
  )
}
