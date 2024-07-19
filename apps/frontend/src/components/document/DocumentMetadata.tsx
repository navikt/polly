import React from 'react'
import { Block } from 'baseui/block'
import { Document } from '../../constants'
import DocumentInfoTypeTable from './DocumentInfoTypeTable'

type DocumentMetadata = {
  document: Document
}

const DocumentMetadata = (props: DocumentMetadata) => {
  const { document } = props

  return (
    <React.Fragment>
      <div>
        <DocumentInfoTypeTable list={document.informationTypes} />
      </div>
    </React.Fragment>
  )
}

export default DocumentMetadata
