import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Tab } from 'baseui/tabs'
import { HeadingMedium, ParagraphSmall } from 'baseui/typography'
import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { IDisclosure, IDocument, IInformationType, IPolicy } from '../../../constants'
import { canViewAlerts } from '../../../pages/AlertEventPage'
import { CodelistService, ICodelistProps } from '../../../service/Codelist'
import { user } from '../../../service/User'
import { theme } from '../../../util'
import { lastModifiedDate } from '../../../util/date-formatter'
import { useQueryParam } from '../../../util/hooks'
import Button from '../../common/Button/CustomButton'
import { CustomizedTabs } from '../../common/CustomizedTabs'
import { Spinner } from '../../common/Spinner'
import { tabOverride } from '../../common/Style'
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
      <div className="flex justify-end mr-2.5">
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
  const [activeTab, setActiveTab] = useState('purposes')
  const navigate: NavigateFunction = useNavigate()
  const [codelistUtils] = CodelistService()

  return (
    <>
      {informationtype && (
        <>
          <div className="flex justify-between">
            <HeadingMedium marginTop="0">{informationtype.name}</HeadingMedium>
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
                  icon={faExclamationCircle}
                  onClick={() => navigate(`/alert/events/informationtype/${informationtype.id}`)}
                >
                  Varsler
                </Button>
              </div>
            )}
            <ParagraphSmall>
              <i>{`Sist endret av ${informationtype.changeStamp.lastModifiedBy}, ${lastModifiedDate(informationtype.changeStamp?.lastModifiedDate)}`}</i>
            </ParagraphSmall>
          </div>

          <CustomizedTabs
            activeKey={activeTab}
            onChange={(args) => setActiveTab(args.activeKey as string)}
          >
            <Tab key="purposes" title="Brukes til behandlingsaktivitet" overrides={tabOverride}>
              {!policies && (
                <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />
              )}
              {policies && <Purposes policies={policies} codelistUtils={codelistUtils} />}
            </Tab>
            <Tab key="disclose" title="Utleveringer til ekstern part" overrides={tabOverride}>
              {!disclosures && (
                <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />
              )}
              {disclosures && <TableDisclosure list={disclosures} codelistUtils={codelistUtils} />}
            </Tab>
            <Tab key="document" title="Dokumenter" overrides={tabOverride}>
              {!documents && (
                <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />
              )}
              {documents && <DocumentTable documents={documents} />}
            </Tab>
          </CustomizedTabs>
        </>
      )}
    </>
  )
}
