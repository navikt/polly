import {useParams} from 'react-router-dom'
import React from 'react'
import ProcessList from '../components/Purpose'
import {Section} from './ProcessPage'
import {PageHeader} from '../components/common/PageHeader'
import {InfoTypeTable} from '../components/InformationType/InfoTypeTableSimple'
import {intl} from '../util'
import {getInformationTypesBy} from '../api'

export const ProductAreaPage = () => {
  const {productAreaId} = useParams<{productAreaId: string}>()

  return (
    <>
      <PageHeader section={Section.productarea} code={productAreaId}/>
      <ProcessList code={productAreaId} section={Section.productarea}/>

      <InfoTypeTable title={intl.informationTypes}
                     getInfoTypes={async () => (await getInformationTypesBy({productArea: productAreaId})).content}/>
    </>
  )
}
