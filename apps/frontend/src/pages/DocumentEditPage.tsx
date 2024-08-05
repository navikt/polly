import { HeadingMedium } from 'baseui/typography'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import shortid from 'shortid'
import { getDocument, updateInformationTypesDocument } from '../api'
import DocumentForm from '../components/document/component/DocumentForm'
import { Document, DocumentFormValues, DocumentInfoTypeUse } from '../constants'
import { ampli } from '../service/Amplitude'
import { codelist } from '../service/Codelist'
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
  const [document, setDocument] = useState<Document>()
  const [isLoading, setLoading] = useState(false)
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  ampli.logEvent('besøk', { side: 'Dokumenter', url: '/document/:id/edit', app: 'Behandlingskatalogen', type: 'Rediger dokument' })

  const handleEditDocument = async (values: DocumentFormValues) => {
    try {
      const res = await updateInformationTypesDocument(convertDocumentToFormRequest(values))
      navigate(`/document/${res.id}`)
    } catch (error: any) {
      console.log(error, 'ERR')
    }
  }

  useEffect(() => {
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
    <Fragment>
      {!isLoading && document && (
        <Fragment>
          <HeadingMedium>Redigér dokument</HeadingMedium>
          <DocumentForm initialValues={convertToDocumentFormValues(document)} handleSubmit={handleEditDocument} />
        </Fragment>
      )}
    </Fragment>
  )
}

export default DocumentEditPage
