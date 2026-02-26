import {
  Alert,
  Button,
  Heading,
  Label,
  Loader,
  Radio,
  RadioGroup,
  Select,
  Tabs,
  Textarea,
} from '@navikt/ds-react'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { CSSObjectWithLabel } from 'react-select'
import AsyncSelect from 'react-select/async'
import * as yup from 'yup'
import { searchProcessOptions, useAllAreas } from '../../../api/GetAllApi'
import { getAvdelingOptions } from '../../../api/NomApi'
import {
  EProcessSelection,
  IProcessRevisionRequest,
  IProductArea,
  TOption,
} from '../../../constants'
import { env } from '../../../util/env'
import {
  DropdownIndicator,
  noOptionMessage,
  selectOverrides,
} from '../../common/AsyncSelectComponents'

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

const requestRevisionSearchSelectOverrides = {
  ...selectOverrides,
  placeholder: (base: CSSObjectWithLabel) =>
    ({
      ...(selectOverrides as any).placeholder(base),
      color: '#E0E1E5',
    }) as CSSObjectWithLabel,
}

interface IRequestRevisionPageProps {
  processId?: string
}

export const RequestRevisionPage = (props: IRequestRevisionPageProps) => {
  const { processId } = props
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [alleAvdelingOptions, setAlleAvdelingOptions] = useState<TOption[]>([])

  useEffect(() => {
    ;(async () => {
      await getAvdelingOptions().then(setAlleAvdelingOptions)
    })()
  }, [])

  const areas: IProductArea[] = useAllAreas()

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
    setError(undefined)
  }

  const selectOnlyCompleted = (formikBag: any) => {
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
      </RadioGroup>
    )
  }

  return (
    <div>
      <Heading level="1" size="large">
        Send anmodning om revidering
      </Heading>

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
        onReset={reset}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(formikBag) => (
          <Form>
            {done && (
              <div>
                <Alert variant="success">Revidering etterspurt</Alert>
              </div>
            )}
            <div className="flex w-full mt-4"></div>

            <Tabs
              defaultValue="logg"
              value={formikBag.values.processSelection}
              onChange={(value) => formikBag.setFieldValue('processSelection', value)}
            >
              <Tabs.List>
                <Tabs.Tab value={EProcessSelection.ONE} label="Én behandling" />
                <Tabs.Tab value={EProcessSelection.ALL} label="Alle behandlinger" />
                <Tabs.Tab value={EProcessSelection.DEPARTMENT} label="Avdeling" />
                <Tabs.Tab value={EProcessSelection.PRODUCT_AREA} label="Område" />
              </Tabs.List>
              <Tabs.Panel value={EProcessSelection.ONE} className="h-48 w-full p-4">
                <div className="flex w-full mt-4 my-3">
                  <div className="my-3 w-1/2">
                    <Label>Legg til en behandling fra Behandlingskatalogen</Label>

                    <AsyncSelect
                      className="w-full mt-1"
                      aria-label="Søk etter behandlinger"
                      placeholder="Søk"
                      components={{ DropdownIndicator }}
                      noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
                      loadingMessage={() => 'Søker...'}
                      isClearable={true}
                      styles={requestRevisionSearchSelectOverrides}
                      loadOptions={searchProcessOptions}
                      onChange={(val) => {
                        formikBag.setFieldValue('processId', val ? (val as any).value : '')
                      }}
                    />
                  </div>
                </div>
                {formikBag.errors.processId && (
                  <p className="navds-error-message flex gap-2">
                    <span>•</span>
                    Feltet er påkrevd
                  </p>
                )}
              </Tabs.Panel>
              <Tabs.Panel value={EProcessSelection.ALL} className="h-48 w-full p-4">
                {selectOnlyCompleted(formikBag)}
              </Tabs.Panel>
              <Tabs.Panel value={EProcessSelection.DEPARTMENT} className="h-68 w-full p-4">
                <Select
                  className="w-1/2"
                  label="Avdeling"
                  hideLabel
                  onChange={(ev) => formikBag.setFieldValue('department', ev.currentTarget.value)}
                  value={formikBag.values.department || ''}
                  error={formikBag.errors.department}
                >
                  <option key="" value="">
                    Velg avdeling
                  </option>
                  {alleAvdelingOptions.map((department) => (
                    <option key={`option_${department.value}`} value={department.value}>
                      {department.label}
                    </option>
                  ))}
                </Select>
                {selectOnlyCompleted(formikBag)}
              </Tabs.Panel>
              <Tabs.Panel value={EProcessSelection.PRODUCT_AREA} className="h-68 w-full p-4">
                <Select
                  className="w-1/2"
                  label="Område"
                  hideLabel
                  onChange={(ev) =>
                    formikBag.setFieldValue('productAreaId', ev.currentTarget.value)
                  }
                  value={formikBag.values.productAreaId || ''}
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
                onChange={(event) => {
                  formikBag.setFieldValue('revisionText', event.target.value)
                }}
                error={formikBag.errors.revisionText}
                minRows={6}
              />
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <Button variant="secondary" type="reset">
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
