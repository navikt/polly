import { useParams } from 'react-router-dom'
import React from 'react'
import { ListName } from '../service/Codelist'
import ProcessList from '../components/Process'
import { Section } from './ProcessPage'
import { getInformationTypesBy } from '../api'
import { PageHeader } from '../components/common/PageHeader'
import { InfoTypeTable } from '../components/InformationType/InfoTypeTableSimple'
import { intl } from '../util'
import {ampli} from "../service/Amplitude";

export const SystemPage = () => {
  const { systemCode } = useParams<{ systemCode: string }>()

  ampli.logEvent("besøk", {side: 'Systemer'})

  return (
    <>
      {systemCode && (
        <>
          <PageHeader section={Section.system} code={systemCode} />
          <ProcessList section={Section.system} code={systemCode} listName={ListName.SYSTEM} isEditable={false} />
        </>
      )}

      <InfoTypeTable title={intl.orgMasterInfTypeHeader} getInfoTypes={async () => (await getInformationTypesBy({ orgMaster: systemCode })).content} />
    </>
  )
}
