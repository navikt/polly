import { Tabs } from '@navikt/ds-react'
import { useParams } from 'react-router-dom'
import { getInformationTypesBy } from '../api'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import { ampli } from '../service/Amplitude'
import { ListName } from '../service/Codelist'
import { Section } from './ProcessPage'

export const SystemPage = () => {
  const { systemCode } = useParams<{ systemCode: string }>()

  ampli.logEvent('besøk', { side: 'Systemer', url: '/system/:systemCode', app: 'Behandlingskatalogen' })

  return (
    <>
      {systemCode && (
        <>
          <PageHeader section={Section.system} code={systemCode} />

          <Tabs>
            <Tabs.List>
              <Tabs.Tab value="behandlinger" label="Behandlinger" />
              <Tabs.Tab value="opplysningstyper" label="opplysningstyper" />
            </Tabs.List>
            <Tabs.Panel value="behandlinger">
              <ProcessList section={Section.system} code={systemCode} listName={ListName.SYSTEM} isEditable={false} />
            </Tabs.Panel>
            <Tabs.Panel value="opplysningstyper">
              <InfoTypeTable title="Opplysningstyper systemet er master for" getInfoTypes={async () => (await getInformationTypesBy({ orgMaster: systemCode })).content} />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </>
  )
}
