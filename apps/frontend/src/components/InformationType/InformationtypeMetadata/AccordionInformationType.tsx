import { faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, BodyShort } from '@navikt/ds-react'
import queryString from 'query-string'
import { useState } from 'react'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router'
import { IPolicy } from '../../../constants'
import { TPurposeMap } from '../../../pages/InformationtypePage'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { useQueryParam } from '../../../util/hooks'
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
  codelistUtils: ICodelistProps
}

const AccordionInformationType = (props: IAccordionInformationtypeProps) => {
  const { policies, codelistUtils } = props
  const selectedPurpose = useQueryParam('purpose')
  const navigate: NavigateFunction = useNavigate()
  const location: Location<any> = useLocation()
  const [openPurpose, setOpenPurpose] = useState<string | undefined>(selectedPurpose || undefined)

  if (!policies) return <BodyShort>Fant ingen formål</BodyShort>
  if (!codelistUtils.isLoaded()) return <BodyShort>Kunne ikke laste inn siden</BodyShort>

  const purposeMap: TPurposeMap = reducePolicyList(policies)
  const getPolicylistForPurpose = (purpose: string): IPolicy[] =>
    !purposeMap[purpose] ? [] : purposeMap[purpose]

  return (
    <Accordion>
      {Object.keys(purposeMap).map((key: string) => (
        <Accordion.Item
          key={key}
          open={openPurpose === key}
          onOpenChange={(open) => {
            const pathname: string = location.pathname
            const purpose = open ? key : undefined
            setOpenPurpose(purpose)
            navigate(pathname + '?' + queryString.stringify({ purpose }, { skipNull: true }))
          }}
        >
          <Accordion.Header>
            <span>
              <FontAwesomeIcon icon={faUsersCog} />{' '}
              {codelistUtils.getShortname(EListName.PURPOSE, key)}
            </span>
          </Accordion.Header>
          <Accordion.Content className="p-0">
            <InformationtypePolicyTable
              policies={getPolicylistForPurpose(key)}
              showPurpose={false}
              codelistUtils={codelistUtils}
            />
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default AccordionInformationType
