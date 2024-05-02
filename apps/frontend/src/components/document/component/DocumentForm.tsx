import React from 'react'
import { Block, BlockProps } from 'baseui/block'
import { LabelMedium } from 'baseui/typography'
import { useAwait } from '../../../util'
import { Input, SIZE } from 'baseui/input'
import { Textarea } from 'baseui/textarea'
import { DocumentFormValues } from '../../../constants'
import InformationTypesTable from './InformationTypesTable'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { user } from '../../../service/User'
import { createDocumentSchema } from '../../common/schema'
import { Notification } from 'baseui/notification'
import { searchDocuments } from '../../../api'
import Button from '../../common/Button'
import { disableEnter } from '../../../util/helper-functions'
import { Select, Value, Option } from 'baseui/select'
import { ListName, codelist } from '../../../service/Codelist'
import { StyledLink } from 'baseui/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

const rowBlockProps: BlockProps = {
  width: '50%',
  marginBottom: '2rem',
}

const labelProps: BlockProps = {
  marginBottom: '1rem',
}

type DocumentFormProps = {
  initialValues: DocumentFormValues
  handleSubmit: Function
}

const DocumentForm = (props: DocumentFormProps) => {
  const initialValueDataAccessClass = () => {
    if (!props.initialValues.dataAccessClass || !codelist.isLoaded()) return []
    return [
      {
        id: props.initialValues.dataAccessClass,
        label: codelist.getShortname(ListName.DATA_ACCESS_CLASS, props.initialValues.dataAccessClass),
      },
    ]
  }

  const [isLoading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState()
  const [dataAccessClass, setDataAccessClass] = React.useState<Option>(initialValueDataAccessClass())

  const { initialValues, handleSubmit } = props
  const hasAccess = () => user.canWrite()
  useAwait(user.wait(), setLoading)

  const onSubmit = async (values: DocumentFormValues, actions: FormikHelpers<DocumentFormValues>) => {
    const searchResults = (await searchDocuments(values.name)).content.filter((doc) => doc.name?.toLowerCase() === values.name?.toLowerCase() && initialValues.id !== doc.id)
    if (searchResults.length > 0) {
      actions.setFieldError('name', 'Dokument med samme navn eksisterer allerede')
    } else {
      try {
        handleSubmit(values)
      } catch (e: any) {
        setErrorMessage(e.message)
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
          <Block {...rowBlockProps}>
            <Block>
              <LabelMedium {...labelProps}>Navn</LabelMedium>
              <Field name="name">{(props: FieldProps) => <Input type="text" size={SIZE.default} {...props.field} />}</Field>
              <Error fieldName="name" fullWidth={true} />
            </Block>
          </Block>
          <Block {...rowBlockProps}>
            <LabelMedium {...labelProps}>Beskrivelse</LabelMedium>
            <Field name="description">{(props: FieldProps) => <Textarea {...props.field} />}</Field>
            <Error fieldName="description" fullWidth={true} />
          </Block>

          <Block {...rowBlockProps}>
            <Field
              name="dataAccessClass"
              render={({ form }: FieldProps<DocumentFormValues>) => (
                <Block>
                  <Block {...labelProps}>
                    <ModalLabel
                      label='Datatilgangsklasse'
                      tooltip={
                        <Block>
                          Mer informasjon finner du
                          <StyledLink target="_blank" rel="noopener noreferrer" href={'https://confluence.adeo.no/pages/viewpage.action?pageId=245389995'}>
                            her
                            <span>
                              <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
                            </span>
                          </StyledLink>
                        </Block>
                      }
                    />
                  </Block>

                  <Select
                    options={codelist.getParsedOptions(ListName.DATA_ACCESS_CLASS)}
                    value={dataAccessClass as Value}
                    placeholder={formikProps.values.dataAccessClass ? '' : 'Velg datatilgangsklasse'}
                    onChange={(params) => {
                      let dac = params.value.length ? params.value[0] : undefined
                      setDataAccessClass(dac as Option)
                      form.setFieldValue('dataAccessClass', dac ? dac.id : undefined)
                    }}
                    error={!!form.errors.dataAccessClass && !!form.submitCount}
                  />
                </Block>
              )}
            />
            <Error fieldName="dataAccessClass" fullWidth={true} />
          </Block>

          <Block marginTop="3rem">
            <LabelMedium marginBottom="2rem">Opplysningstyper i dokumentet</LabelMedium>
            <FieldArray name="informationTypes" render={(arrayHelpers: FieldArrayRenderProps) => <InformationTypesTable arrayHelpers={arrayHelpers} />} />
          </Block>
          <Block display="flex" justifyContent="flex-end" marginTop="10px">
            {errorMessage && (
              <Block marginRight="scale800">
                <Notification kind="negative">{errorMessage}</Notification>
              </Block>
            )}

            <Button type="button" kind="secondary" onClick={() => window.history.back()}>
              Avbryt
            </Button>

            <Button type="submit" kind="primary" marginLeft marginRight>
              Lagre
            </Button>
          </Block>
        </Form>
      )}
    </Formik>
  )
}

export default DocumentForm
