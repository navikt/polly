import React from 'react'
import {Section} from './ProcessPage'
import {PageHeader} from '../components/common/PageHeader'
import {useParams} from 'react-router-dom'


export const DataProcessorPage = () => {
  const {id} = useParams<{ id: string }>()

  return (
    <>

      <PageHeader section={Section.dataprocessor} code={id}/>
    </>
  )
}
export default DataProcessorPage


