'use client'

import { getDocument, updateInformationTypesDocument } from '@/api/DocumentApi'
import { IDocument, IDocumentFormValues, IDocumentInfoTypeUse } from '@/constants'
import { useNavigate } from '@/util/router'
import { getConflictAwareErrorMessage, isConflictError } from '@/util/optimisticLocking'
import { Heading } from '@navikt/ds-react'
import { useParams } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import shortid from 'shortid'
import { getDocument, updateInformationTypesDocument } from '@/api/DocumentApi'
import { IDocument, IDocumentFormValues, IDocumentInfoTypeUse } from '@/constants'
import { useNavigate } from '@/util/router'
import DocumentForm from '../document/component/DocumentForm'
import { convertDocumentToFormRequest } from './DocumentCreatePage'

const convertToDocumentFormValues = (document: IDocument) => {
  return {
    id: document.id,
    // Optimistisk låsing: ta vare på versjonen vi leste, slik at den kan sendes ved lagring
    version: document.version,
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
  const [errorMessage, setErrorMessage] = useState('')
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleEditDocument = async (values: IDocumentFormValues) => {
    try {
      const res = await updateInformationTypesDocument(convertDocumentToFormRequest(values))
      navigate(`/document/${res.id}`)
    } catch (error: any) {
      console.debug(error, 'ERR')
      if (isConflictError(error) && params.id) {
        // Optimistisk låsing: dokumentet er endret av en annen bruker.
        // Hent inn gjeldende data på nytt i stedet for å overskrive i stillhet.
        setDocument(await getDocument(params.id))
      }
      setErrorMessage(getConflictAwareErrorMessage(error))
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
          <Heading size='large'>Redigér dokument</Heading>
          <DocumentForm
            initialValues={convertToDocumentFormValues(document)}
            handleSubmit={handleEditDocument}
          />
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </Fragment>
      )}
    </Fragment>
  )
}

export default DocumentEditPage
