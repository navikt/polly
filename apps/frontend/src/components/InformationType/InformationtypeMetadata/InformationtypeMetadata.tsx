import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Tab } from 'baseui/tabs'
import { HeadingMedium, ParagraphSmall } from 'baseui/typography'
import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Disclosure, Document, InformationType, Policy } from '../../../constants'
import { canViewAlerts } from '../../../pages/AlertEventPage'
import { user } from '../../../service/User'
import { theme } from '../../../util'
import { lastModifiedDate } from '../../../util/date-formatter'
import { useQueryParam } from '../../../util/hooks'
import Button from '../../common/Button'
import { CustomizedTabs } from '../../common/CustomizedTabs'
import { Spinner } from '../../common/Spinner'
import { tabOverride } from '../../common/Style'
import TableDisclosure from '../../common/TableDisclosure'
import { InformationTypeBannerButtons } from '../InformationTypeBannerButtons'
import AccordionInformationType from './AccordionInformationType'
import { DocumentTable } from './DocumentTable'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import Metadata from './Metadata'

interface InformationtypeMetadataProps {
  informationtype: InformationType
  policies?: Policy[]
  disclosures?: Disclosure[]
  documents?: Document[]
}

interface IPurposesProps {
  policies: Policy[]
}

const Purposes = ({ policies }: IPurposesProps) => {
  const selectedPurpose: string | undefined = useQueryParam('purpose')
  const [accordion, setAccordion] = useState(!!selectedPurpose)

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => setAccordion(!accordion)}
          size="compact"
          shape="pill"
          kind="outline"
          $style={{
            position: 'relative',
            marginTop: `-${theme.sizing.scale1200}`,
            marginLeft: `-${theme.sizing.scale400}`,
            right: theme.sizing.scale600,
            bottom: theme.sizing.scale600,
          }}
        >
          {accordion ? 'Vis alle' : 'Gruppér etter behandlingsaktivitet'}
        </Button>
      </div>
      {accordion ? <AccordionInformationType policies={policies} /> : <InformationtypePolicyTable policies={policies} showPurpose={true} />}
    </div>
  )
}

interface IDisclosuresProps {
  disclosures: Disclosure[]
}

const Disclosures = ({ disclosures }: IDisclosuresProps) => (
  <TableDisclosure list={disclosures} showRecipient editable={false} onCloseModal={() => console.log('skal fjerrens også!')} />
)

export const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
  const { informationtype, policies, disclosures, documents } = props
  const [activeTab, setActiveTab] = useState('purposes')
  const navigate: NavigateFunction = useNavigate()

  return (
    <>
      {informationtype && (
        <>
          <div className="flex justify-between">
            <HeadingMedium marginTop="0">{informationtype.name}</HeadingMedium>
            {user.canWrite() && <InformationTypeBannerButtons id={informationtype.id} />}
          </div>

          <Metadata informationtype={informationtype} />

          <div className="flex justify-end mb-4">
            {canViewAlerts() && (
              <div className="mr-auto">
                <Button type="button" kind="tertiary" size="compact" icon={faExclamationCircle} onClick={() => navigate(`/alert/events/informationtype/${informationtype.id}`)}>
                  Varsler
                </Button>
              </div>
            )}
            <ParagraphSmall>
              <i>{`Sist endret av ${informationtype.changeStamp.lastModifiedBy}, ${lastModifiedDate(informationtype.changeStamp?.lastModifiedDate)}`}</i>
            </ParagraphSmall>
          </div>

          <CustomizedTabs activeKey={activeTab} onChange={(args) => setActiveTab(args.activeKey as string)}>
            <Tab key="purposes" title="Brukes til behandlingsaktivitet" overrides={tabOverride}>
              {!policies && <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />}
              {policies && <Purposes policies={policies} />}
            </Tab>
            <Tab key="disclose" title="Utleveringer til ekstern part" overrides={tabOverride}>
              {!disclosures && <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />}
              {disclosures && <Disclosures disclosures={disclosures} />}
            </Tab>
            <Tab key="document" title="Dokumenter" overrides={tabOverride}>
              {!documents && <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />}
              {documents && <DocumentTable documents={documents} />}
            </Tab>
          </CustomizedTabs>
        </>
      )}
    </>
  )
}
