import * as React from 'react'
import {useState} from 'react'
import {Block} from 'baseui/block'

import AccordionInformationtype from './AccordionInformationtype'
import {Disclosure, Document, InformationType, Policy} from '../../../constants'
import {intl, theme} from '../../../util'
import Metadata from './Metadata'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import TableDisclosure from '../../common/TableDisclosure'
import {DocumentTable} from './DocumentTable'
import {Tab} from 'baseui/tabs'
import {H4, ParagraphSmall} from 'baseui/typography'
import {user} from '../../../service/User'
import {InformationTypeBannerButtons} from '../InformationTypeBannerButtons'
import Button from '../../common/Button'
import {CustomizedTabs} from "../../common/CustomizedTabs";
import {tabOverride} from "../../common/Style";
import {lastModifiedDate} from "../../../util/date-formatter";
import {canViewAlerts} from '../../../pages/AlertEventPage'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import {RouteComponentProps, withRouter} from 'react-router-dom'

interface InformationtypeMetadataProps {
  informationtype: InformationType;
  policies: Policy[];
  disclosures: Disclosure[],
  documents: Document[],
  expanded: string[]
  onSelectPurpose: (purpose: string) => void
}

const Purposes = ({policies, expanded, onSelectPurpose}: { policies: Policy[], expanded: string[], onSelectPurpose: (purpose: string) => void }) => {
  const [accordion, setAccordion] = React.useState(false)
  return (
    <Block>
      <Block display="flex" justifyContent="flex-end">
        <Button onClick={() => setAccordion(!accordion)} size="compact" shape="pill" kind='outline'
                $style={{position: 'absolute', marginTop: `-${theme.sizing.scale1200}`, marginLeft: `-${theme.sizing.scale400}`}}
        >
          {accordion ? intl.showAll : intl.groupByPurpose}
        </Button>
      </Block>
      {accordion ?
        <AccordionInformationtype policies={policies} expaneded={expanded} onChange={args => args.expanded.length && onSelectPurpose(args.expanded[0] as string)}/>
        : <InformationtypePolicyTable policies={policies} showPurpose={true}/>}
    </Block>
  )
}

const Disclosures = ({disclosures}: { disclosures: Disclosure[] }) => {
  return (
    <TableDisclosure
      list={disclosures}
      showRecipient
      editable={false}
      onCloseModal={() => console.log('skal fjerrens også')}
    />
  )
}

const InformationtypeMetadata = (props: InformationtypeMetadataProps & RouteComponentProps<any>) => {
  const [activeTab, setActiveTab] = useState('purposes')
  return (
    <>
      {props.informationtype && (
        <>
          <Block display="flex" justifyContent="space-between">
            <H4 marginTop="0">{props.informationtype.name}</H4>
            {user.canWrite() && (
              <InformationTypeBannerButtons id={props.informationtype.id}/>
            )}
          </Block>

          <Metadata informationtype={props.informationtype}/>

          <Block display='flex' justifyContent='flex-end' marginBottom={theme.sizing.scale600}>
            {canViewAlerts() && <Block marginRight='auto'>
              <Button type='button' kind='tertiary' size='compact' icon={faExclamationCircle}
                      onClick={() => props.history.push(`/alert/events/informationtype/${props.informationtype.id}`)}>{intl.alerts}</Button>
            </Block>}
            <ParagraphSmall>
              <i>{intl.formatString(intl.lastModified, props.informationtype.changeStamp.lastModifiedBy, lastModifiedDate(props.informationtype.changeStamp.lastModifiedDate))}</i>
            </ParagraphSmall>
          </Block>

          <CustomizedTabs
            activeKey={activeTab}
            onChange={args => setActiveTab(args.activeKey as string)}
          >
            <Tab key="purposes" title={intl.purposeUse} overrides={tabOverride}>
              <Purposes policies={props.policies} expanded={props.expanded} onSelectPurpose={props.onSelectPurpose}/>
            </Tab>
            <Tab key="disclose" title={intl.disclosuresToThirdParty} overrides={tabOverride}>
              <Disclosures disclosures={props.disclosures}/>
            </Tab>
            <Tab key="document" title={intl.documents} overrides={tabOverride}>
              <DocumentTable documents={props.documents}/>
            </Tab>
          </CustomizedTabs>
        </>
      )}
    </>
  )
}

export default withRouter(InformationtypeMetadata)
