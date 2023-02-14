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
      <Block>
        <DocumentInfoTypeTable list={document.informationTypes} />
      </Block>
    </React.Fragment>
  )
}

export default DocumentMetadata
