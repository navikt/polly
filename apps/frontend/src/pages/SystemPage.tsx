import { Tabs } from '@navikt/ds-react'
import { useParams } from 'react-router'
import { getInformationTypesBy } from '../api/GetAllApi'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import ProcessList from '../components/Process/ProcessList'
import { PageHeader } from '../components/common/PageHeader'
import { ampli } from '../service/Amplitude'
import { EListName } from '../service/Codelist'
import { ESection } from './ProcessPage'

export const SystemPage = () => {
  const { systemCode } = useParams<{ systemCode: string }>()

  ampli.logEvent('besøk', {
    side: 'Systemer',
    url: '/system/:systemCode',
    app: 'Behandlingskatalogen',
  })

  return (
    <>
      {systemCode && (
        <>
          <PageHeader section={ESection.system} code={systemCode} />

          <Tabs defaultValue="behandlinger">
            <Tabs.List>
              <Tabs.Tab value="behandlinger" label="Behandlinger" />
              <Tabs.Tab value="opplysningstyper" label="Opplysningstyper" />
            </Tabs.List>
            <Tabs.Panel value="behandlinger">
              <ProcessList
                section={ESection.system}
                code={systemCode}
                listName={EListName.SYSTEM}
                isEditable={false}
              />
            </Tabs.Panel>
            <Tabs.Panel value="opplysningstyper">
              <InfoTypeTable
                title="Opplysningstyper systemet er master for"
                getInfoTypes={async () =>
                  (await getInformationTypesBy({ orgMaster: systemCode })).content
                }
              />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </>
  )
}
