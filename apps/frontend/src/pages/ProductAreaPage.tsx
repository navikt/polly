import {useParams} from 'react-router-dom'
import React from 'react'
import ProcessList from '../components/Process'
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
      <ProcessList section={Section.productarea} code={productAreaId}/>

      <InfoTypeTable title={intl.informationTypes}
                     getInfoTypes={async () => (await getInformationTypesBy({productArea: productAreaId})).content}/>
    </>
  )
}
