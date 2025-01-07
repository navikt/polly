import { HeadingMedium } from 'baseui/typography'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import shortid from 'shortid'
import { getDocument, updateInformationTypesDocument } from '../api/GetAllApi'
import DocumentForm from '../components/document/component/DocumentForm'
import { IDocument, IDocumentFormValues, IDocumentInfoTypeUse } from '../constants'
import { ampli } from '../service/Amplitude'
import { convertDocumentToFormRequest } from './DocumentCreatePage'

const convertToDocumentFormValues = (document: IDocument) => {
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
      } as IDocumentInfoTypeUse
    }),
  } as IDocumentFormValues
}

const DocumentEditPage = () => {
  const [document, setDocument] = useState<IDocument>()
  const [isLoading, setLoading] = useState(false)
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  ampli.logEvent('besøk', {
    side: 'Dokumenter',
    url: '/document/:id/edit',
    app: 'Behandlingskatalogen',
    type: 'Rediger dokument',
  })

  const handleEditDocument = async (values: IDocumentFormValues) => {
    try {
      const res = await updateInformationTypesDocument(convertDocumentToFormRequest(values))
      navigate(`/document/${res.id}`)
    } catch (error: any) {
      console.debug(error, 'ERR')
    }
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
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
          <DocumentForm
            initialValues={convertToDocumentFormValues(document)}
            handleSubmit={handleEditDocument}
          />
        </Fragment>
      )}
    </Fragment>
  )
}

export default DocumentEditPage
