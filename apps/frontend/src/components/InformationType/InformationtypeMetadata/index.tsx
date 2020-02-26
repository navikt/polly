import * as React from 'react'
import { useState } from 'react'
import { Block } from 'baseui/block'

import AccordionInformationtype from './AccordionInformationtype'
import { Disclosure, Document, InformationType, Policy } from '../../../constants'
import { intl, theme, useAwait } from '../../../util'
import Metadata from './Metadata'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import TableDisclosure from '../../common/TableDisclosure'
import { DocumentTable } from './DocumentTable'
import { Tab, Tabs } from 'baseui/tabs'
import { H4 } from 'baseui/typography'
import { user } from '../../../service/User'
import { InformationTypeBannerButtons } from '../InformationTypeBannerButtons'
import Button from '../../common/Button'
import { paddingAll, paddingZero } from '../../common/Style'

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

const InformationtypeMetadata = (props: InformationtypeMetadataProps) => {
  const [activeTab, setActiveTab] = useState('purposes')

  useAwait(user.wait())

  const tabOverride = {Tab: {style: {fontSize: '1.5rem'}}}
  return (
    <>
      {props.informationtype && (
        <>
          <Block display="flex" justifyContent="space-between">
            <H4 marginTop={theme.sizing.scale400}>{props.informationtype.name}</H4>
            {user.canWrite() && (
              <InformationTypeBannerButtons id={props.informationtype.id}/>
            )}
          </Block>

          <Metadata informationtype={props.informationtype}/>

          <Tabs activeKey={activeTab} onChange={args => setActiveTab(args.activeKey as string)}
                overrides={{
                  Root: {
                    style: {
                      outline: `4px ${theme.colors.primary200} solid`
                    }
                  },
                  TabContent: {
                    style: paddingZero
                  },
                  TabBar: {
                    style: {
                      ...paddingAll(theme.sizing.scale600)
                    }
                  }
                }}
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
          </Tabs>
        </>
      )}
    </>
  )
}

export default InformationtypeMetadata
