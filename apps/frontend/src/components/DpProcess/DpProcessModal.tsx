import { Accordion, Button, ErrorSummary, Modal, TextField } from '@navikt/ds-react'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { IDpProcessFormValues } from '../../constants'
import { CodelistService } from '../../service/Codelist'
import { disableEnter } from '../../util/helper-functions'
import BoolField from '../Process/common/BoolField'
import CustomizedModalBlock from '../common/CustomizedModalBlock'
import FieldProduct from '../common/FieldProduct'
import { Error, ModalLabel } from '../common/ModalSchema'
import { dpProcessSchema } from '../common/schemaValidation'
import FieldDescription from './common/FieldDescription'
import FieldDpProcessAffiliation from './common/FieldDpProcessAffiliation'
import FieldDpProcessDataProcessingAgreements from './common/FieldDpProcessDataProcessingAgreements'
import { FieldDpProcessDates } from './common/FieldDpProcessDates'
import FieldDpProcessExternalProcessResponsible from './common/FieldDpProcessExternalProcessResponsible'
import FieldDpProcessSubDataProcessor from './common/FieldDpProcessSubDataProcessor'
import FieldPurposeDescription from './common/FieldPurposeDescription'
import RetentionItems from './common/RetentionItems'

type TFormikError = unknown

const pathToAnchorId = (path: string): string => {
  if (!path) return 'form'

  if (path.startsWith('affiliation')) return 'organizing'
  if (path.startsWith('subDataProcessing')) return 'subDataProcessor'
  if (path.startsWith('retention')) return 'retention'

  const root = path.replace(/\[\d+\]/g, '')
  const anchor = root.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  return anchor || 'form'
}

const ANCHOR_ID_PREFIX = 'dp-process-'
const fieldId = (fieldName: string) => `${ANCHOR_ID_PREFIX}${pathToAnchorId(fieldName)}`

const flattenFormikErrors = (
  errors: TFormikError,
  basePath = ''
): Array<{ path: string; message: string }> => {
  if (!errors) return []

  if (typeof errors === 'string') {
    return basePath ? [{ path: basePath, message: errors }] : [{ path: '', message: errors }]
  }

  if (Array.isArray(errors)) {
    return errors.flatMap((value, index) => flattenFormikErrors(value, `${basePath}[${index}]`))
  }

  if (typeof errors === 'object') {
    return Object.entries(errors as Record<string, unknown>).flatMap(([key, value]) =>
      flattenFormikErrors(value, basePath ? `${basePath}.${key}` : key)
    )
  }

  return []
}

const errorSummaryFieldLabels: Record<string, string> = {
  name: 'Navn',
  externalProcessResponsible: 'Behandlingsansvarlig',
  description: 'Beskrivelse',
  purposeDescription: 'Formål',
  start: 'Startdato',
  end: 'Sluttdato',
  art9: 'Særlige kategorier av personopplysninger',
  art10: 'Straffedommer og lovovertredelser',
  'affiliation.products': 'System',
  dataProcessingAgreements: 'Ref. til databehandleravtale',
  affiliation: 'Organisering',
  subDataProcessing: 'Underdatabehandler',
  retention: 'Lagringsbehov',
}

const errorSummaryLabelForPath = (path: string): string | undefined => {
  const normalizedPath = path.replace(/\[\d+\]/g, '')
  return (
    errorSummaryFieldLabels[normalizedPath] ?? errorSummaryFieldLabels[normalizedPath.split('.')[0]]
  )
}

const buildErrorSummaryItems = (
  errors: TFormikError
): Array<{ anchorId: string; message: string; anchorKey: string }> => {
  const seen = new Set<string>()
  return flattenFormikErrors(errors)
    .filter((e) => e.message && e.path)
    .map((e) => {
      const anchorKey = pathToAnchorId(e.path)
      const anchorId = fieldId(anchorKey)
      const label = errorSummaryLabelForPath(e.path)
      return { anchorKey, anchorId, message: label ? `${label}: ${e.message}` : e.message }
    })
    .filter((e) => {
      if (seen.has(e.anchorId)) return false
      seen.add(e.anchorId)
      return true
    })
}

const focusById = (anchorId: string) => {
  const el = document.getElementById(anchorId)
  if (!el) return

  el.scrollIntoView({ block: 'center' })

  if ('focus' in el && typeof (el as any).focus === 'function') {
    ;(el as any).focus()
  }
}

const FormikSubmitEffects = (props: {
  formikBag: FormikProps<IDpProcessFormValues>
  setExpanded: (key: string) => void
}) => {
  const { formikBag, setExpanded } = props
  const lastHandledSubmitCount = useRef<number>(0)

  useEffect(() => {
    if (formikBag.submitCount <= lastHandledSubmitCount.current) return

    if (formikBag.errors.affiliation) setExpanded('organizing')
    if (formikBag.errors.subDataProcessing) setExpanded('subDataProcessor')
    if (formikBag.errors.retention) setExpanded('retention')

    lastHandledSubmitCount.current = formikBag.submitCount
  }, [formikBag.submitCount, formikBag.errors, setExpanded])

  return null
}

type TModalDpProcessProps = {
  initialValues: IDpProcessFormValues
  errorOnCreate?: string
  isOpen: boolean
  submit: (dpProcess: IDpProcessFormValues) => Promise<void>
  onClose: () => void
}

const DpProcessModal = (props: TModalDpProcessProps) => {
  const { initialValues, errorOnCreate, isOpen, submit, onClose } = props
  const [codelistUtils] = CodelistService()
  const [expanded, setExpanded] = useState<string>('')

  const onOpenChangeAction = (open: boolean, key: string): void =>
    open ? setExpanded(key) : setExpanded('')

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      header={{ heading: 'Behandlinger hvor Nav er databehandler' }}
      width="960px"
    >
      <Formik
        onSubmit={(values) => {
          submit(values)
        }}
        initialValues={initialValues}
        validationSchema={dpProcessSchema()}
      >
        {(formikBag: FormikProps<IDpProcessFormValues>) => (
          <>
            <Modal.Body>
              <Form id="modal-dp-process-form" onKeyDown={disableEnter}>
                <FormikSubmitEffects formikBag={formikBag} setExpanded={setExpanded} />
                <CustomizedModalBlock first>
                  <ModalLabel
                    label="Navn"
                    tooltip="Et kort navn som beskriver hva behandlingen går ut på, f.eks. saksbehandling eller tilgangsstyring."
                  />
                  <Field name="name">
                    {({ field, form }: FieldProps<string, IDpProcessFormValues>) => (
                      <TextField
                        className="w-full"
                        id={fieldId('name')}
                        label="name"
                        hideLabel
                        {...field}
                        error={!!form.errors.name && form.touched.name}
                      />
                    )}
                  </Field>
                </CustomizedModalBlock>
                <Error fieldName={'name'} />

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Behandlingsansvarlig"
                    tooltip="Oppgi navn på den behandlingsansvarlige virksomheten."
                  />
                  <div className="w-full" id={fieldId('externalProcessResponsible')} tabIndex={-1}>
                    <FieldDpProcessExternalProcessResponsible
                      thirdParty={formikBag.values.externalProcessResponsible}
                    />
                  </div>
                </CustomizedModalBlock>

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Beskrivelse"
                    tooltip="Beskriv behandlingen Nav gjør på vegne av den behandlingsansvarlige, f.eks. innsamling og lagring av personopplysninger."
                  />
                  <div className="w-full" id={fieldId('description')} tabIndex={-1}>
                    <FieldDescription />
                  </div>
                </CustomizedModalBlock>
                <Error fieldName="description" />

                <CustomizedModalBlock>
                  <ModalLabel
                    label="Formål"
                    tooltip="Beskriv formålet med å bruke personopplysninger i denne behandlingen."
                  />
                  <div className="w-full" id={fieldId('purposeDescription')} tabIndex={-1}>
                    <FieldPurposeDescription />
                  </div>
                </CustomizedModalBlock>
                <Error fieldName="purposeDescription" />

                <CustomizedModalBlock>
                  <ModalLabel label="Gyldighetsperiode for behandlingen" />
                  <FieldDpProcessDates showDates={true} showLabels={true} />
                </CustomizedModalBlock>

                <div className="w-full mt-4">
                  <ModalLabel
                    label="Behandles det særlige kategorier av personopplysninger?"
                    tooltip="Med særlige kategorier personopplysninger menes opplysninger om helse, etnisk opprinnelse, politikk, religion og filosofisk overbevisning, fagforeningsmedlemskap, genetikk og biometri, seksuelle forhold og legning."
                    fullwidth
                  />
                  <div className="mt-2">
                    <BoolField
                      fieldName="art9"
                      value={formikBag.values.art9}
                      direction="horizontal"
                    />
                  </div>
                </div>

                <div className="w-full mt-4">
                  <ModalLabel
                    label="Behandles det personopplysninger om straffedommer og lovovertredelser?"
                    fullwidth
                  />
                  <div className="mt-2">
                    <BoolField
                      fieldName="art10"
                      value={formikBag.values.art10}
                      direction="horizontal"
                    />
                  </div>
                </div>

                <div className="w-full mt-4">
                  <ModalLabel
                    label="System"
                    tooltip="Angi hvilke systemer som er primært i bruk i denne behandlingen."
                    fullwidth
                  />
                  <div className="mt-2" id={fieldId('affiliation.products')} tabIndex={-1}>
                    <FieldProduct formikBag={formikBag} codelistUtils={codelistUtils} />
                  </div>
                </div>

                <div className="w-full mt-8">
                  <ModalLabel label="Ref. til databehandleravtale" fullwidth />
                  <div className="mt-2" id={fieldId('dataProcessingAgreements')} tabIndex={-1}>
                    <FieldDpProcessDataProcessingAgreements formikBag={formikBag} />
                  </div>
                </div>
                <Error fieldName="dataProcessingAgreements" />

                <Accordion className="mt-6">
                  <Accordion.Item
                    open={expanded === 'organizing'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'organizing')}
                  >
                    <Accordion.Header id={fieldId('organizing')} tabIndex={-1}>
                      Organisering
                    </Accordion.Header>
                    <Accordion.Content>
                      <FieldDpProcessAffiliation
                        formikBag={formikBag}
                        codelistUtils={codelistUtils}
                      />
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item
                    open={expanded === 'subDataProcessor'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'subDataProcessor')}
                  >
                    <Accordion.Header
                      className="z-0"
                      id={fieldId('subDataProcessor')}
                      tabIndex={-1}
                    >
                      Underdatabehandler
                    </Accordion.Header>

                    <Accordion.Content>
                      <FieldDpProcessSubDataProcessor
                        formikBag={formikBag}
                        initialValues={initialValues}
                      />
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item
                    open={expanded === 'retention'}
                    onOpenChange={(open: boolean) => onOpenChangeAction(open, 'retention')}
                  >
                    <Accordion.Header className="z-0" id={fieldId('retention')} tabIndex={-1}>
                      Lagringsbehov
                    </Accordion.Header>
                    <Accordion.Content>
                      <RetentionItems formikBag={formikBag} />
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Form>
            </Modal.Body>

            <Modal.Footer
              style={{
                borderTop: 0,
              }}
            >
              <div className="w-full flex flex-col gap-4">
                {formikBag.submitCount > 0 && Object.keys(formikBag.errors ?? {}).length > 0 && (
                  <div className="max-h-48 overflow-auto">
                    <ErrorSummary
                      className="polly-error-summary-flush"
                      heading="Du må rette disse feilene før du kan lagre"
                      size="small"
                    >
                      {buildErrorSummaryItems(formikBag.errors).map((e) => (
                        <ErrorSummary.Item
                          key={e.anchorId}
                          href={`#${e.anchorId}`}
                          onClick={(evt) => {
                            evt.preventDefault()

                            if (e.anchorKey === 'organizing') setExpanded('organizing')
                            if (e.anchorKey === 'subDataProcessor') setExpanded('subDataProcessor')
                            if (e.anchorKey === 'retention') setExpanded('retention')

                            focusById(e.anchorId)
                          }}
                        >
                          {e.message}
                        </ErrorSummary.Item>
                      ))}
                    </ErrorSummary>
                  </div>
                )}

                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" variant="tertiary" onClick={() => onClose()}>
                    Avbryt
                  </Button>
                  <Button type="submit" form="modal-dp-process-form">
                    Lagre
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </Modal>
  )
}

export default DpProcessModal
