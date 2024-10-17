import { HeadingMedium } from 'baseui/typography'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import { createInformationTypesDocument } from '../api/GetAllApi'
import DocumentForm from '../components/document/component/DocumentForm'
import { IDocumentFormValues } from '../constants'
import { ampli } from '../service/Amplitude'

const initialCreateDocumentFormValues: IDocumentFormValues = {
  name: '',
  description: '',
  informationTypes: [],
  dataAccessClass: undefined,
}

export const convertDocumentToFormRequest = (values: IDocumentFormValues) => {
  const newValue = { ...values, dataAccessClass: values.dataAccessClass }

  newValue.informationTypes.forEach((it) => {
    const subCatList: any = []
    it.subjectCategories.forEach((subCat) => {
      subCatList.push({ code: subCat })
    })
    it.subjectCategories = subCatList
  })

  return newValue
}

const DocumentCreatePage = () => {
  const navigate = useNavigate()

  ampli.logEvent('besøk', {
    side: 'Dokumenter',
    url: '/document/create',
    app: 'Behandlingskatalogen',
    type: 'Opprett dokument',
  })

  const handleCreateDocument = async (values: IDocumentFormValues) => {
    try {
      const res = await createInformationTypesDocument(convertDocumentToFormRequest(values))
      navigate(`/document/${res.id}`)
    } catch (error: any) {
      console.debug(error, 'Error')
    }
  }

  return (
    <Fragment>
      <HeadingMedium>Opprett dokument</HeadingMedium>
      <DocumentForm
        initialValues={initialCreateDocumentFormValues}
        handleSubmit={handleCreateDocument}
      />
    </Fragment>
  )
}

export default DocumentCreatePage
