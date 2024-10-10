import { Fragment } from 'react'
import { IDocument } from '../../constants'
import DocumentInfoTypeTable from './DocumentInfoTypeTable'

type TDocumentMetadata = {
  document: IDocument
}

const DocumentMetadata = (props: TDocumentMetadata) => {
  const { document } = props

  return (
    <Fragment>
      <div>
        <DocumentInfoTypeTable list={document.informationTypes} />
      </div>
    </Fragment>
  )
}

export default DocumentMetadata
