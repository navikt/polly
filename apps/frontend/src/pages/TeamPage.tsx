import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDisclosureByProductTeam, getInformationTypesBy } from '../api/GetAllApi'
import ProcessDisclosureTabs from '../components/Dashboard/ProcessDisclosureTabs'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import { PageHeader } from '../components/common/PageHeader'
import { IDisclosure } from '../constants'
import { ampli } from '../service/Amplitude'
import { ESection } from './ProcessPage'

export const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const [disclosureData, setDisclosureData] = useState<IDisclosure[]>([])

  useEffect(() => {
    if (teamId) {
      ;(async () => {
        const disclosureResponse = await getDisclosureByProductTeam(teamId)
        if (disclosureResponse) setDisclosureData(disclosureResponse.content)
      })()
    }
  }, [teamId])

  ampli.logEvent('besøk', { side: 'Team', url: '/team/:id', app: 'Behandlingskatalogen' })

  return (
    <>
      {teamId && (
        <>
          <PageHeader section={ESection.team} code={teamId} />

          <ProcessDisclosureTabs
            disclosureData={disclosureData}
            setDisclosureData={setDisclosureData}
            section={ESection.team}
            code={teamId}
            isEditable={false}
            thirdTabTitle="Opplysningstyper"
            thirdTabContent={
              <InfoTypeTable
                title="Opplysningstyper"
                getInfoTypes={async () =>
                  (await getInformationTypesBy({ productTeam: teamId })).content
                }
              />
            }
          />
        </>
      )}
    </>
  )
}
