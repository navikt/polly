import { Fragment } from 'react'
import { Document } from '../../constants'
import DocumentInfoTypeTable from './DocumentInfoTypeTable'

type DocumentMetadata = {
  document: Document
}

const DocumentMetadata = (props: DocumentMetadata) => {
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
