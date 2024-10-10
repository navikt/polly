import { faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Panel } from 'baseui/accordion'
import { ParagraphMedium } from 'baseui/typography'
import queryString from 'query-string'
import { Key } from 'react'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import { IPolicy } from '../../../constants'
import { TPurposeMap } from '../../../pages/InformationtypePage'
import { EListName, ICode, codelist } from '../../../service/Codelist'
import { useQueryParam } from '../../../util/hooks'
import { toggleOverride } from '../../common/Accordion'
import { paddingZero } from '../../common/Style'
import InformationtypePolicyTable from './InformationtypePolicyTable'

const reducePolicyList = (list: IPolicy[]) => {
  return list.reduce((acc: TPurposeMap, curr: IPolicy) => {
    curr.purposes.forEach((purpose: ICode) => {
      if (!acc[purpose.code]) {
        acc[purpose.code] = [curr]
      } else {
        acc[purpose.code].push(curr)
      }
    })

    return acc
  }, {})
}

export interface IAccordionInformationtypeProps {
  policies: IPolicy[]
}

const AccordionInformationType = (props: IAccordionInformationtypeProps) => {
  const { policies } = props
  const selectedPurpose = useQueryParam('purpose')
  const navigate: NavigateFunction = useNavigate()
  const location: Location<any> = useLocation()

  if (!policies) return <ParagraphMedium>Fant ingen formål</ParagraphMedium>
  if (!codelist.isLoaded()) return <ParagraphMedium>Kunne ikke laste inn siden</ParagraphMedium>

  const purposeMap: TPurposeMap = reducePolicyList(policies)
  const getPolicylistForPurpose = (purpose: string): IPolicy[] =>
    !purposeMap[purpose] ? [] : purposeMap[purpose]

  return (
    <Accordion
      initialState={{ expanded: selectedPurpose ? [selectedPurpose] : [] }}
      onChange={(key) => {
        const pathname: string = location.pathname
        const purpose: Key = key.expanded[0]
        navigate(pathname + '?' + queryString.stringify({ purpose }, { skipNull: true }))
      }}
    >
      {Object.keys(purposeMap).map((key: string) => (
        <Panel
          title={
            <span>
              <FontAwesomeIcon icon={faUsersCog} /> {codelist.getShortname(EListName.PURPOSE, key)}
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
