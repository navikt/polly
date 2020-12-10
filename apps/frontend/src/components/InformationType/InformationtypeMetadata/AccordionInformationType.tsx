import * as React from 'react'
import {Accordion, Panel} from 'baseui/accordion'
import {Paragraph2} from 'baseui/typography'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronDown, faChevronRight, faUsersCog} from '@fortawesome/free-solid-svg-icons'

import {codelist, ListName} from '../../../service/Codelist'
import {intl} from '../../../util'
import {PurposeMap} from '../../../pages/InformationtypePage'
import {Policy} from '../../../constants'
import {paddingZero} from '../../common/Style'
import {useQueryParam} from '../../../util/hooks'
import {useHistory} from 'react-router-dom'
import * as queryString from 'query-string'

const reducePolicyList = (list: Policy[]) => {
  return list.reduce((acc: PurposeMap, curr) => {
    curr.purposes.forEach(purpose => {
      if (!acc[purpose.code]) {
        acc[purpose.code] = [curr]
      } else {
        acc[purpose.code].push(curr)
      }
    })

    return acc
  }, {})
}

export interface AccordionInformationtypeProps {
  policies: Policy[]
}

const AccordionInformationType = (props: AccordionInformationtypeProps) => {
  const {policies} = props
  const selectedPurpose = useQueryParam('purpose')
  const history = useHistory()
  if (!policies) return <Paragraph2>{intl.purposeNotFound}</Paragraph2>
  if (!codelist.isLoaded()) return <Paragraph2>{intl.couldntLoad}</Paragraph2>

  const purposeMap = reducePolicyList(policies)
  const getPolicylistForPurpose = (purpose: string) => !purposeMap[purpose] ? [] : purposeMap[purpose]

  return (
    <Accordion initialState={{expanded: selectedPurpose ? [selectedPurpose] : []}}
               onChange={key => {
                 let pathname = history.location.pathname
                 let purpose = key.expanded[0]
                 history.push(pathname + '?' + queryString.stringify({purpose}, {skipNull: true}))
               }}>
      {Object.keys(purposeMap).map((key) => (
        <Panel title={<span><FontAwesomeIcon icon={faUsersCog}/> {codelist.getShortname(ListName.PURPOSE, key)}</span>} key={key}
               overrides={{
                 ToggleIcon: {component: (iconProps: any) => iconProps.title !== 'Expand' ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>},
                 Content: {style: paddingZero}
               }}
        >
          <InformationtypePolicyTable policies={getPolicylistForPurpose(key)} showPurpose={false}/>
        </Panel>
      ))}

    </Accordion>
  )
}

export default AccordionInformationType
