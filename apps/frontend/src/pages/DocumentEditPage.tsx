import React from 'react'
import DocumentForm from '../components/document/component/DocumentForm'
import {useHistory, useParams} from 'react-router-dom'
import {codelist} from '../service/Codelist'
import {getDocument, updateInformationTypesDocument} from '../api'
import {Document, DocumentFormValues, DocumentInfoTypeUse,} from '../constants'
import shortid from 'shortid'
import {H4} from 'baseui/typography'
import {intl} from '../util'

const convertToDocumentFormValues = (document: Document) => {
  return {
    id: document.id,
    name: document.name,
    description: document.description,
    informationTypes: document.informationTypes.map(it => {
      return {
        id: shortid.generate(),
        informationTypeId: it.informationTypeId,
        informationType: it.informationType,
        subjectCategories: it.subjectCategories
      } as DocumentInfoTypeUse
    })
  } as DocumentFormValues
}

const DocumentEditPage = () => {
  const [document, setDocument] = React.useState<Document>()
  const [isLoading, setLoading] = React.useState(false)
  const params = useParams<{id: string}>()
  const history = useHistory()

  const handleEditDocument = async (values: DocumentFormValues) => {
    try {
      const res = await updateInformationTypesDocument(values)
      history.push(`/document/${res.id}`)
    } catch (err) {
      console.log(err, 'ERR')
    }
  }

  React.useEffect(() => {
    (async () => {
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
          <H4>{intl.editDocument}</H4>
          <DocumentForm initialValues={convertToDocumentFormValues(document)} handleSubmit={handleEditDocument} />
        </React.Fragment>

      )}
    </React.Fragment>
  )
}

export default DocumentEditPage
