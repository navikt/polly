import * as React from 'react'
import { Accordion, Panel, SharedProps } from 'baseui/accordion'
import { Paragraph2 } from 'baseui/typography'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronRight, faUsersCog } from "@fortawesome/free-solid-svg-icons"

import { codelist, ListName } from "../../../service/Codelist"
import { intl } from "../../../util"
import { PurposeMap } from "../../../pages/InformationtypePage"
import { Policy } from "../../../constants"

const reducePolicylist = (list: Policy[]) => {
  return list.reduce((acc: PurposeMap, curr) => {
    if (!acc[curr.purposeCode.code]) {
      acc[curr.purposeCode.code] = [curr]
    } else {
      acc[curr.purposeCode.code].push(curr)
    }

    return acc
  }, {})
}

export interface AccordionInformationtypeProps {
  policies: Policy[];
  expaneded: string[];
  onChange?: (args: { expanded: React.Key[] }) => void;
}

const AccordionInformationtype = (props: AccordionInformationtypeProps) => {
  const {policies, onChange, expaneded} = props
  if (!policies) return <Paragraph2>{intl.purposeNotFound}</Paragraph2>
  if (!codelist.isLoaded()) return <Paragraph2>{intl.couldntLoad}</Paragraph2>

  const purposeMap = reducePolicylist(policies)
  const getPolicylistForPurpose = (purpose: string) => !purposeMap[purpose] ? [] : purposeMap[purpose]

  return (
    <Accordion initialState={{expanded: expaneded}} onChange={onChange}>
      {Object.keys(purposeMap).map((key) => (
        <Panel title={<span><FontAwesomeIcon icon={faUsersCog}/> {codelist.getShortname(ListName.PURPOSE, key)}</span>} key={key}
               overrides={{
                 ToggleIcon: {component: (iconProps: SharedProps) => !!iconProps.$expanded ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
               }}
        >
          <InformationtypePolicyTable policies={getPolicylistForPurpose(key)} showPurpose={false}/>
        </Panel>
      ))}

    </Accordion>
  )
}

export default AccordionInformationtype
