import { ExclamationmarkIcon } from '@navikt/aksel-icons'
import { BodyShort, Heading, Loader, Tabs } from '@navikt/ds-react'
import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { IDisclosure, IDocument, IInformationType, IPolicy } from '../../../constants'
import { canViewAlerts } from '../../../pages/AlertEventPage'
import { CodelistService, ICodelistProps } from '../../../service/Codelist'
import { user } from '../../../service/User'
import { lastModifiedDate } from '../../../util/date-formatter'
import { useQueryParam } from '../../../util/hooks'
import Button from '../../common/Button/CustomButton'
import TableDisclosure from '../../common/TableDisclosure'
import { InformationTypeBannerButtons } from '../InformationTypeBannerButtons'
import AccordionInformationType from './AccordionInformationType'
import { DocumentTable } from './DocumentTable'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import Metadata from './Metadata'

interface IInformationtypeMetadataProps {
  informationtype: IInformationType
  policies?: IPolicy[]
  disclosures?: IDisclosure[]
  documents?: IDocument[]
}

interface IPurposesProps {
  policies: IPolicy[]
  codelistUtils: ICodelistProps
}

const Purposes = (props: IPurposesProps) => {
  const { policies, codelistUtils } = props
  const selectedPurpose: string | undefined = useQueryParam('purpose')
  const [accordion, setAccordion] = useState(!!selectedPurpose)

  return (
    <div>
      <div className="flex justify-end mr-2.5 mt-2.5">
        <Button onClick={() => setAccordion(!accordion)} size="xsmall" kind="outline">
          {accordion ? 'Vis alle' : 'Gruppér etter behandlingsaktivitet'}
        </Button>
      </div>
      {accordion ? (
        <AccordionInformationType policies={policies} codelistUtils={codelistUtils} />
      ) : (
        <InformationtypePolicyTable
          policies={policies}
          showPurpose={true}
          codelistUtils={codelistUtils}
        />
      )}
    </div>
  )
}

export const InformationtypeMetadata = (props: IInformationtypeMetadataProps) => {
  const { informationtype, policies, disclosures, documents } = props
  const navigate: NavigateFunction = useNavigate()
  const [codelistUtils] = CodelistService()

  return (
    <>
      {informationtype && (
        <>
          <div className="flex justify-between">
            <Heading level="1" size="medium" className="m-0">
              {informationtype.name}
            </Heading>
            {user.canWrite() && <InformationTypeBannerButtons id={informationtype.id} />}
          </div>

          <Metadata informationtype={informationtype} codelistUtils={codelistUtils} />

          <div className="flex justify-end mb-4">
            {canViewAlerts() && (
              <div className="mr-auto">
                <Button
                  type="button"
                  kind="tertiary"
                  size="xsmall"
                  icon={
                    <span className="flex items-center leading-none">
                      <ExclamationmarkIcon aria-hidden className="block" />
                    </span>
                  }
                  onClick={() => navigate(`/alert/events/informationtype/${informationtype.id}`)}
                >
                  Varsler
                </Button>
              </div>
            )}
            <BodyShort>
              <i>{`Sist endret av ${informationtype.changeStamp.lastModifiedBy}, ${lastModifiedDate(informationtype.changeStamp?.lastModifiedDate)}`}</i>
            </BodyShort>
          </div>

          <Tabs defaultValue="purposes">
            <Tabs.List>
              <Tabs.Tab value="purposes" label="Brukes til behandlingsaktivitet" />
              <Tabs.Tab value="disclose" label="Utleveringer til ekstern part" />
              <Tabs.Tab value="document" label="Dokumenter" />
            </Tabs.List>
            <Tabs.Panel value="purposes">
              {!policies && (
                <div className="flex w-full justify-center">
                  <Loader size="3xlarge" />
                </div>
              )}
              {policies && <Purposes policies={policies} codelistUtils={codelistUtils} />}
            </Tabs.Panel>
            <Tabs.Panel value="disclose">
              {!disclosures && (
                <div className="flex w-full justify-center">
                  <Loader size="3xlarge" />
                </div>
              )}
              {disclosures && <TableDisclosure list={disclosures} codelistUtils={codelistUtils} />}
            </Tabs.Panel>
            <Tabs.Panel value="document">
              {!documents && (
                <div className="flex w-full justify-center">
                  <Loader size="3xlarge" />
                </div>
              )}
              {documents && <DocumentTable documents={documents} />}
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </>
  )
}
