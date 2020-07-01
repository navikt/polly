import React from 'react'
import DocumentForm from '../components/document/component/DocumentForm'
import {DocumentFormValues} from '../constants'
import {createInformationTypesDocument} from '../api'
import {useHistory} from 'react-router-dom'
import {H4} from 'baseui/typography'
import {intl} from '../util'

let initialCreateDocumentFormValues: DocumentFormValues = {
  name: '',
  description: '',
  informationTypes: []
}

const DocumentCreatePage = () => {
  const history = useHistory()

  const handleCreateDocument = async (values: DocumentFormValues) => {
    let body = {...values}
    try {
      const res = await createInformationTypesDocument(body)
      history.push(`/document/${res.id}`)
    } catch (error) {
      console.log(error, 'Error')
    }
  }

  return (
    <React.Fragment>
      <H4>{intl.createdDocument}</H4>
      <DocumentForm initialValues={initialCreateDocumentFormValues} handleSubmit={handleCreateDocument}/>
    </React.Fragment>
  )
}

export default DocumentCreatePage
