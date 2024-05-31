import React from 'react'
import DocumentForm from '../components/document/component/DocumentForm'
import { DocumentFormValues } from '../constants'
import { createInformationTypesDocument } from '../api'
import { useNavigate } from 'react-router-dom'
import { HeadingMedium } from 'baseui/typography'
import {ampli} from "../service/Amplitude";

let initialCreateDocumentFormValues: DocumentFormValues = {
  name: '',
  description: '',
  informationTypes: [],
  dataAccessClass: undefined,
}

export const convertDocumentToFormRequest = (values: DocumentFormValues) => {
  let newValue = { ...values, dataAccessClass: values.dataAccessClass }

  newValue.informationTypes.forEach((it) => {
    let subCatList: any = []
    it.subjectCategories.forEach((subCat) => {
      subCatList.push({ code: subCat })
    })
    it.subjectCategories = subCatList
  })

  return newValue
}

const DocumentCreatePage = () => {
  const navigate = useNavigate()

  ampli.logEvent("besøk", {side: 'Dokumenter', url: '/document/create', app: 'Behandlingskatalogen', type:'Opprett dokument'})

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      const res = await createInformationTypesDocument(convertDocumentToFormRequest(values))
      navigate(`/document/${res.id}`)
    } catch (error: any) {
      console.log(error, 'Error')
    }
  }

  return (
    <React.Fragment>
      <HeadingMedium>Opprett dokument</HeadingMedium>
      <DocumentForm initialValues={initialCreateDocumentFormValues} handleSubmit={handleCreateDocument} />
    </React.Fragment>
  )
}

export default DocumentCreatePage
