import * as React from 'react'
import { Accordion, Panel } from 'baseui/accordion'
import { ParagraphMedium } from 'baseui/typography'
import InformationtypePolicyTable from './InformationtypePolicyTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { codelist, ListName } from '../../../service/Codelist'
import { PurposeMap } from '../../../pages/InformationtypePage'
import { Policy } from '../../../constants'
import { paddingZero } from '../../common/Style'
import { useQueryParam } from '../../../util/hooks'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { toggleOverride } from '../../common/Accordion'

const reducePolicyList = (list: Policy[]) => {
  return list.reduce((acc: PurposeMap, curr) => {
    curr.purposes.forEach((purpose) => {
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
  const { policies } = props
  const selectedPurpose = useQueryParam('purpose')
  const navigate = useNavigate()
  const location = useLocation()
  if (!policies) return <ParagraphMedium>Fant ingen formål</ParagraphMedium>
  if (!codelist.isLoaded()) return <ParagraphMedium>Kunne ikke laste inn siden</ParagraphMedium>

  const purposeMap = reducePolicyList(policies)
  const getPolicylistForPurpose = (purpose: string) => (!purposeMap[purpose] ? [] : purposeMap[purpose])

  return (
    <Accordion
      initialState={{ expanded: selectedPurpose ? [selectedPurpose] : [] }}
      onChange={(key) => {
        let pathname = location.pathname
        let purpose = key.expanded[0]
        navigate(pathname + '?' + queryString.stringify({ purpose }, { skipNull: true }))
      }}
    >
      {Object.keys(purposeMap).map((key) => (
        <Panel
          title={
            <span>
              <FontAwesomeIcon icon={faUsersCog} /> {codelist.getShortname(ListName.PURPOSE, key)}
            </span>
          }
          key={key}
          overrides={{
            ToggleIcon: toggleOverride,
            Content: { style: paddingZero },
          }}
        >
          <InformationtypePolicyTable policies={getPolicylistForPurpose(key)} showPurpose={false} />
        </Panel>
      ))}
    </Accordion>
  )
}

export default AccordionInformationType
