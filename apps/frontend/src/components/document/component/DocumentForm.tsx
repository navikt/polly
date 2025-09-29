import { Label, Link, Select, TextField, Textarea } from '@navikt/ds-react'
import { Notification } from 'baseui/notification'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik'
import { useState } from 'react'
import { searchDocuments } from '../../../api/GetAllApi'
import { IDocument, IDocumentFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'
import { user } from '../../../service/User'
import { useAwait } from '../../../util'
import { disableEnter } from '../../../util/helper-functions'
import Button from '../../common/Button/CustomButton'
import { Error } from '../../common/ModalSchema'
import { createDocumentSchema } from '../../common/schemaValidation'
import InformationTypesTable from './InformationTypesTable'

type TDocumentFormProps = {
  initialValues: IDocumentFormValues
  handleSubmit: (values: IDocumentFormValues) => Promise<void>
}

const DocumentForm = (props: TDocumentFormProps) => {
  const { initialValues, handleSubmit } = props
  const [codelistUtils] = CodelistService()

  const [isLoading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  const hasAccess = (): boolean => user.canWrite()
  useAwait(user.wait(), setLoading)

  const onSubmit = async (
    values: IDocumentFormValues,
    actions: FormikHelpers<IDocumentFormValues>
  ) => {
    const searchResults: IDocument[] = (await searchDocuments(values.name)).content.filter(
      (doc) => doc.name?.toLowerCase() === values.name?.toLowerCase() && initialValues.id !== doc.id
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
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={createDocumentSchema()}
    >
      {(formikProps: FormikProps<IDocumentFormValues>) => (
        <Form onKeyDown={disableEnter}>
          <div className="w-[50%] mb-8">
            <div>
              <Field name="name">
                {(props: FieldProps) => (
                  <TextField className="w-full" label="Navn" {...props.field} />
                )}
              </Field>
              <Error fieldName="name" fullWidth={true} />
            </div>
          </div>
          <div className="w-[50%] mb-8">
            <Field name="description">
              {(props: FieldProps) => (
                <Textarea className="w-full" label="Beskrivelse" {...props.field} />
              )}
            </Field>
            <Error fieldName="description" fullWidth={true} />
          </div>

          <div className="w-[50%] mb-8">
            <Field
              name="dataAccessClass"
              render={({ form }: FieldProps<IDocumentFormValues>) => (
                <Select
                  label="Datatilgangsklasse"
                  description={
                    <div>
                      Mer informasjon finner du{' '}
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={'https://confluence.adeo.no/pages/viewpage.action?pageId=245389995'}
                      >
                        her (åpnes i ny fane)
                      </Link>
                    </div>
                  }
                  value={formikProps.values.dataAccessClass}
                  onChange={async (event) => {
                    await form.setFieldValue('dataAccessClass', event.target.value)
                  }}
                >
                  <option value="">Velg datatilgangsklasse</option>
                  {codelistUtils.getParsedOptions(EListName.DATA_ACCESS_CLASS).map((code) => (
                    <option key={code.id} value={code.id}>
                      {code.label}
                    </option>
                  ))}
                </Select>
              )}
            />
            <Error fieldName="dataAccessClass" fullWidth={true} />
          </div>

          <div className="mt-12">
            <Label size="medium">Opplysningstyper i dokumentet</Label>
            <FieldArray
              name="informationTypes"
              render={(arrayHelpers: FieldArrayRenderProps) => (
                <InformationTypesTable codelistUtils={codelistUtils} arrayHelpers={arrayHelpers} />
              )}
            />
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
