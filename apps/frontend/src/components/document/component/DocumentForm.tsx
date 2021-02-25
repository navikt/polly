import React from 'react'
import {Block, BlockProps} from 'baseui/block'
import {Label2} from 'baseui/typography'
import {intl, useAwait} from '../../../util'
import {Input, SIZE} from 'baseui/input'
import {Textarea} from 'baseui/textarea'
import {DocumentFormValues} from '../../../constants'
import InformationTypesTable from './InformationTypesTable'
import {Field, FieldArray, FieldProps, Form, Formik, FormikHelpers, FormikProps} from 'formik'
import {Error} from '../../common/ModalSchema'
import {user} from '../../../service/User'
import {createDocumentValidation} from '../../common/schema'
import {Notification} from 'baseui/notification'
import {searchDocuments} from '../../../api'
import Button from '../../common/Button'
import {disableEnter} from "../../../util/helper-functions";

const rowBlockProps: BlockProps = {
  width: '50%',
  marginBottom: '2rem',
}

const labelProps: BlockProps = {
  marginBottom: '1rem'
}

type DocumentFormProps = {
  initialValues: DocumentFormValues;
  handleSubmit: Function;
}

const DocumentForm = (props: DocumentFormProps) => {
  const [isLoading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState()

  const {initialValues, handleSubmit} = props
  const hasAccess = () => user.canWrite()
  useAwait(user.wait(), setLoading)

  const onSubmit = async (values: DocumentFormValues, actions: FormikHelpers<DocumentFormValues>) => {
    const searchResults = (await searchDocuments(values.name))
    .content.filter(doc => doc.name?.toLowerCase() === values.name?.toLowerCase() && initialValues.id !== doc.id)
    if (searchResults.length > 0) {
      actions.setFieldError('name', intl.documentExists)
    } else {
      try {
        handleSubmit(values)
      } catch (e) {
        setErrorMessage(e.message)
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
      validationSchema={createDocumentValidation()}
    >
      {
        (formikProps: FormikProps<DocumentFormValues>) => (
          <Form onKeyDown={disableEnter}>
            <Block {...rowBlockProps}>
              <Block>
                <Label2 {...labelProps}>{intl.name}</Label2>
                <Field name="name">
                  {
                    (props: FieldProps) => (
                      <Input type="text" size={SIZE.default} {...props.field}/>
                    )
                  }
                </Field>
                <Error fieldName="name" fullWidth={true}/>
              </Block>
            </Block>
            <Block {...rowBlockProps}>
              <Label2 {...labelProps}>{intl.description}</Label2>
              <Field name="description">
                {
                  (props: FieldProps) => (
                    <Textarea
                      {...props.field}
                    />
                  )
                }
              </Field>
              <Error fieldName="description" fullWidth={true}/>
            </Block>

            <Block marginTop="3rem">
              <Label2 marginBottom="2rem">{intl.informationtypesUsedInDocument}</Label2>
              <FieldArray
                name="informationTypes"
                render={
                  arrayHelpers => (
                    <InformationTypesTable
                      arrayHelpers={arrayHelpers}
                    />
                  )
                }
              />
            </Block>
            <Block display="flex" justifyContent='flex-end' marginTop="10px">
              {errorMessage && (
                <Block marginRight="scale800">
                  <Notification kind="negative">
                    {errorMessage}
                  </Notification>
                </Block>
              )}

              <Button
                type="button"
                kind="secondary"
                onClick={() => window.history.back()}
              >
                {intl.abort}
              </Button>

              <Button
                type="submit"
                kind="primary"
                marginLeft
                marginRight
              >
                {intl.save}
              </Button>
            </Block>
          </Form>
        )
      }
    </Formik>
  )
}

export default DocumentForm
