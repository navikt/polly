import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'
import ProcessList from '../components/Process'
import { Section } from './ProcessPage'
import { PageHeader } from '../components/common/PageHeader'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import { intl } from '../util'
import { getDisclosureByProductTeam, getInformationTypesBy } from '../api'
import {ampli} from "../service/Amplitude";
import { Disclosure } from '../constants'
import ProcessDisclosureTabs from '../components/Dashboard/ProcessDisclosureTabs'

export const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const [disclosureData, setDisclosureData] = React.useState<Disclosure[]>([])

  useEffect(() => {
    if (teamId) {
      ;(async () => {
          let disclosureResponse = await getDisclosureByProductTeam(teamId)
          if (disclosureResponse) setDisclosureData(disclosureResponse.content)

      })()
    }
  }, [teamId])
  

  ampli.logEvent("besøk", {side: 'Team', url: '/team/:id', app: 'Behandlingskatalogen'})

  return (
    <>
      {teamId && (
        <>
          <PageHeader section={Section.team} code={teamId} />

          <ProcessDisclosureTabs 
            disclosureData={disclosureData}
            setDisclosureData={setDisclosureData}
            section={Section.team}
            code={teamId}
            isEditable={false}
          />

        </>
      )}

      <InfoTypeTable title={intl.informationTypes} getInfoTypes={async () => (await getInformationTypesBy({ productTeam: teamId })).content} />
    </>
  )
}
