import { Fragment } from 'react'
import { Document } from '../../constants'
import DocumentInfoTypeTable from './DocumentInfoTypeTable'

type TDocumentMetadata = {
  document: Document
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
