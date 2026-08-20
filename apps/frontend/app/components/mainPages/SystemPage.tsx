import { getInformationTypesBy } from '@/api/InfoTypeApi'
import { EListName } from '@/service/Codelist'
import { useParams } from '@/util/router'
import { Tabs } from '@navikt/ds-react'
import { InfoTypeTable } from '../InformationType/InfoTypeTableSimple'
import ProcessList from '../Process/ProcessList'
import { PageHeader } from '../common/PageHeader'
import { ESection } from './ProcessPage'

export const SystemPage = () => {
  const { systemCode } = useParams<{ systemCode: string }>()

  return (
    <>
      {systemCode && (
        <>
          <PageHeader section={ESection.system} code={systemCode} />

          <Tabs defaultValue='behandlinger'>
            <Tabs.List>
              <Tabs.Tab value='behandlinger' label='Behandlinger' />
              <Tabs.Tab value='opplysningstyper' label='Opplysningstyper' />
            </Tabs.List>
            <Tabs.Panel value='behandlinger'>
              <ProcessList
                section={ESection.system}
                code={systemCode}
                listName={EListName.SYSTEM}
                isEditable={false}
              />
            </Tabs.Panel>
            <Tabs.Panel value='opplysningstyper'>
              <InfoTypeTable
                title='Opplysningstyper systemet er master for'
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
