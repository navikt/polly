import React from 'react'
import DocumentForm from '../components/document/component/DocumentForm'
import { useNavigate, useParams } from 'react-router-dom'
import { codelist } from '../service/Codelist'
import { getDocument, updateInformationTypesDocument } from '../api'
import { Document, DocumentFormValues, DocumentInfoTypeUse } from '../constants'
import shortid from 'shortid'
import { HeadingMedium } from 'baseui/typography'
import { intl } from '../util'
import { convertDocumentToFormRequest } from './DocumentCreatePage'

const convertToDocumentFormValues = (document: Document) => {
  return {
    id: document.id,
    name: document.name,
    description: document.description,
    dataAccessClass: document.dataAccessClass?.code || '',
    informationTypes: document.informationTypes.map((it) => {
      return {
        id: shortid.generate(),
        informationTypeId: it.informationTypeId,
        informationType: it.informationType,
        subjectCategories: it.subjectCategories,
      } as DocumentInfoTypeUse
    }),
  } as DocumentFormValues
}

const DocumentEditPage = () => {
  const [document, setDocument] = React.useState<Document>()
  const [isLoading, setLoading] = React.useState(false)
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleEditDocument = async (values: DocumentFormValues) => {
    try {
      const res = await updateInformationTypesDocument(convertDocumentToFormRequest(values))
      navigate(`/document/${res.id}`)
    } catch (err: any) {
      console.log(err, 'ERR')
    }
  }

  React.useEffect(() => {
    ;(async () => {
      setLoading(true)
      await codelist.wait()
      if (params.id) {
        setDocument(await getDocument(params.id))
      }
      setLoading(false)
    })()
  }, [params.id])

  return (
    <React.Fragment>
      {!isLoading && document && (
        <React.Fragment>
          <HeadingMedium>{intl.editDocument}</HeadingMedium>
          <DocumentForm initialValues={convertToDocumentFormValues(document)} handleSubmit={handleEditDocument} />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default DocumentEditPage
