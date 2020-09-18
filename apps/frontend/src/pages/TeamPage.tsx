import {useParams} from 'react-router-dom'
import React from 'react'
import ProcessList from '../components/Process'
import {Section} from './ProcessPage'
import {PageHeader} from '../components/common/PageHeader'
import {InfoTypeTable} from '../components/InformationType/InfoTypeTableSimple'
import {intl} from '../util'
import {getInformationTypesBy} from '../api'

export const TeamPage = () => {
  const {teamId} = useParams<{teamId: string}>()

  return (
    <>
      <PageHeader section={Section.team} code={teamId}/>
      <ProcessList section={Section.team} code={teamId}/>

      <InfoTypeTable title={intl.informationTypes}
                     getInfoTypes={async () => (await getInformationTypesBy({productTeam: teamId})).content}/>
    </>
  )
}
