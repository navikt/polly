import * as React from 'react'
import { useState } from 'react'

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Tab } from 'baseui/tabs'
import { HeadingMedium, ParagraphSmall } from 'baseui/typography'
import { useNavigate } from 'react-router-dom'
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

const Purposes = ({ policies }: { policies: Policy[] }) => {
  const selectedPurpose = useQueryParam('purpose')
  const [accordion, setAccordion] = React.useState(!!selectedPurpose)
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

const Disclosures = ({ disclosures }: { disclosures: Disclosure[] }) => {
  return <TableDisclosure list={disclosures} showRecipient editable={false} onCloseModal={() => console.log('skal fjerrens også!')} />
}

export const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
  const [activeTab, setActiveTab] = useState('purposes')
  const navigate = useNavigate()
  return (
    <>
      {props.informationtype && (
        <>
          <div className="flex justify-between">
            <HeadingMedium marginTop="0">{props.informationtype.name}</HeadingMedium>
            {user.canWrite() && <InformationTypeBannerButtons id={props.informationtype.id} />}
          </div>

          <Metadata informationtype={props.informationtype} />

          <div className="flex justify-end mb-4">
            {canViewAlerts() && (
              <div className="mr-auto">
                <Button
                  type="button"
                  kind="tertiary"
                  size="compact"
                  icon={faExclamationCircle}
                  onClick={() => navigate(`/alert/events/informationtype/${props.informationtype.id}`)}
                >
                  Varsler
                </Button>
              </div>
            )}
            <ParagraphSmall>
              <i>{`Sist endret av ${props.informationtype.changeStamp.lastModifiedBy}, ${lastModifiedDate(props.informationtype.changeStamp?.lastModifiedDate)}`}</i>
            </ParagraphSmall>
          </div>

          <CustomizedTabs activeKey={activeTab} onChange={(args) => setActiveTab(args.activeKey as string)}>
            <Tab key="purposes" title="Brukes til behandlingsaktivitet" overrides={tabOverride}>
              {!props.policies && <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />}
              {props.policies && <Purposes policies={props.policies} />}
            </Tab>
            <Tab key="disclose" title="Utleveringer til ekstern part" overrides={tabOverride}>
              {!props.disclosures && <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />}
              {props.disclosures && <Disclosures disclosures={props.disclosures} />}
            </Tab>
            <Tab key="document" title="Dokumenter" overrides={tabOverride}>
              {!props.documents && <Spinner size={theme.sizing.scale1200} margin={theme.sizing.scale1200} />}
              {props.documents && <DocumentTable documents={props.documents} />}
            </Tab>
          </CustomizedTabs>
        </>
      )}
    </>
  )
}
