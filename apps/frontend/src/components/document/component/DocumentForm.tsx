import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BlockProps } from 'baseui/block'
import { Input, SIZE } from 'baseui/input'
import { StyledLink } from 'baseui/link'
import { Notification } from 'baseui/notification'
import { OnChangeParams, Option, Select, Value } from 'baseui/select'
import { Textarea } from 'baseui/textarea'
import { LabelMedium } from 'baseui/typography'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { useState } from 'react'
import { searchDocuments } from '../../../api'
import { Document, DocumentFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'
import { user } from '../../../service/User'
import { useAwait } from '../../../util'
import { disableEnter } from '../../../util/helper-functions'
import Button from '../../common/Button'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { createDocumentSchema } from '../../common/schema'
import InformationTypesTable from './InformationTypesTable'

const labelProps: BlockProps = {
  marginBottom: '1rem',
}

type DocumentFormProps = {
  initialValues: DocumentFormValues
  handleSubmit: Function
}

const DocumentForm = (props: DocumentFormProps) => {
  const { initialValues, handleSubmit } = props
  const initialValueDataAccessClass = () => {
    if (!initialValues.dataAccessClass || !codelist.isLoaded()) return []

    return [
      {
        id: initialValues.dataAccessClass,
        label: codelist.getShortname(ListName.DATA_ACCESS_CLASS, initialValues.dataAccessClass),
      },
    ]
  }

  const [isLoading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState()
  const [dataAccessClass, setDataAccessClass] = useState<Option>(initialValueDataAccessClass())

  const hasAccess = (): boolean => user.canWrite()
  useAwait(user.wait(), setLoading)

  const onSubmit = async (values: DocumentFormValues, actions: FormikHelpers<DocumentFormValues>) => {
    const searchResults: Document[] = (await searchDocuments(values.name)).content.filter(
      (doc) => doc.name?.toLowerCase() === values.name?.toLowerCase() && initialValues.id !== doc.id,
    )

    if (searchResults.length > 0) {
      actions.setFieldError('name', 'Dokument med samme navn eksisterer allerede')
    } else {
      try {
        handleSubmit(values)
      } catch (error: any) {
        setErrorMessage(error.message)
      }
    }
  }

  if (!hasAccess() || isLoading) {
    return null
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={createDocumentSchema()}>
      {(formikProps: FormikProps<DocumentFormValues>) => (
        <Form onKeyDown={disableEnter}>
          <div className="w-[50%] mb-8">
            <div>
              <LabelMedium {...labelProps}>Navn</LabelMedium>
              <Field name="name">{(props: FieldProps) => <Input type="text" size={SIZE.default} {...props.field} />}</Field>
              <Error fieldName="name" fullWidth={true} />
            </div>
          </div>
          <div className="w-[50%] mb-8">
            <LabelMedium {...labelProps}>Beskrivelse</LabelMedium>
            <Field name="description">{(props: FieldProps) => <Textarea {...props.field} />}</Field>
            <Error fieldName="description" fullWidth={true} />
          </div>

          <div className="w-[50%] mb-8">
            <Field
              name="dataAccessClass"
              render={({ form }: FieldProps<DocumentFormValues>) => (
                <div>
                  <div className="mb-4">
                    <ModalLabel
                      label="Datatilgangsklasse"
                      tooltip={
                        <div>
                          Mer informasjon finner du
                          <StyledLink target="_blank" rel="noopener noreferrer" href={'https://confluence.adeo.no/pages/viewpage.action?pageId=245389995'}>
                            her
                            <span>
                              <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
                            </span>
                          </StyledLink>
                        </div>
                      }
                    />
                  </div>

                  <Select
                    options={codelist.getParsedOptions(ListName.DATA_ACCESS_CLASS)}
                    value={dataAccessClass as Value}
                    placeholder={formikProps.values.dataAccessClass ? '' : 'Velg datatilgangsklasse'}
                    onChange={(params: OnChangeParams) => {
                      let dac = params.value.length ? params.value[0] : undefined
                      setDataAccessClass(dac as Option)
                      form.setFieldValue('dataAccessClass', dac ? dac.id : undefined)
                    }}
                    error={!!form.errors.dataAccessClass && !!form.submitCount}
                  />
                </div>
              )}
            />
            <Error fieldName="dataAccessClass" fullWidth={true} />
          </div>

          <div className="mt-12">
            <LabelMedium marginBottom="2rem">Opplysningstyper i dokumentet</LabelMedium>
            <FieldArray name="informationTypes" render={(arrayHelpers: FieldArrayRenderProps) => <InformationTypesTable arrayHelpers={arrayHelpers} />} />
          </div>
          <div className="flex justify-end mt-2.5">
            {errorMessage && (
              <div className="mr-6">
                <Notification kind="negative">{errorMessage}</Notification>
              </div>
            )}

            <Button type="button" kind="secondary" onClick={() => window.history.back()}>
              Avbryt
            </Button>

            <Button type="submit" kind="primary" marginLeft marginRight>
              Lagre
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default DocumentForm
