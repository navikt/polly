import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tag } from '@navikt/ds-react'
import { LabelLarge } from 'baseui/typography'
import { Ref, RefObject, createRef } from 'react'
import { IProcessShort } from '../../../constants'
import { CodelistService, EListName, ICode } from '../../../service/Codelist'
import { theme } from '../../../util'

type TAccordionTitleProps = {
  process: IProcessShort
  expanded: boolean
  forwardRef?: Ref<any>
}

export const InformationTypeRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>()

const AccordionTitle = (props: TAccordionTitleProps) => {
  const { process, expanded, forwardRef } = props
  const [codelistUtils] = CodelistService()

  const today: string = new Date().toISOString().split('T')[0]

  const isActive: boolean = today < process.end

  return (
    <>
      <div ref={forwardRef}>
        <LabelLarge color={theme.colors.primary}>
          {expanded ? (
            <FontAwesomeIcon icon={faChevronDown} />
          ) : (
            <FontAwesomeIcon icon={faChevronRight} />
          )}
          <span> </span>
          <Tag variant={isActive ? 'success' : 'warning'}>{isActive ? 'Aktiv' : 'Utgått'}</Tag>
          <span> </span>
          <span>
            {process.purposes
              .map((purpose: ICode) => codelistUtils.getShortname(EListName.PURPOSE, purpose.code))
              .join(', ')}
            :{' '}
          </span>
          <span>{process.name}</span>
        </LabelLarge>
      </div>
    </>
  )
}

export default AccordionTitle
