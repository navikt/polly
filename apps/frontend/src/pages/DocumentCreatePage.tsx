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

export const convertDocumentToFormRequest = (values: DocumentFormValues) => {
  let newValue = {...values}

  newValue.informationTypes.forEach(it => {
    let subCatList: any = []
    it.subjectCategories.forEach(subCat => {
      subCatList.push({code: subCat})
    })
    it.subjectCategories = subCatList
  })

  return newValue
}

const DocumentCreatePage = () => {
  const history = useHistory()

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      const res = await createInformationTypesDocument(convertDocumentToFormRequest(values))
      history.push(`/document/${res.id}`)
    } catch (error:any) {
      console.log(error, 'Error')
    }
  }

  return (
    <React.Fragment>
      <H4>{intl.createDocument}</H4>
      <DocumentForm initialValues={initialCreateDocumentFormValues} handleSubmit={handleCreateDocument}/>
    </React.Fragment>
  )
}

export default DocumentCreatePage
