import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tag } from '@navikt/ds-react'
import { LabelLarge } from 'baseui/typography'
import { Ref, createRef } from 'react'
import { IProcessShort } from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { theme } from '../../../util'

type TAccordionTitleProps = {
  codelistUtils: ICodelistProps
  process: IProcessShort
  expanded: boolean
  forwardRef?: Ref<any>
  noChevron?: boolean
}

export const InformationTypeRef = createRef<HTMLDivElement>()

const AccordionTitle = (props: TAccordionTitleProps) => {
  const { process, expanded, forwardRef, codelistUtils, noChevron } = props
  const today: string = new Date().toISOString().split('T')[0]

  const isActive: boolean = today < process.end

  return (
    <div ref={forwardRef}>
      <LabelLarge color={theme.colors.primary}>
        {!noChevron && expanded && <FontAwesomeIcon icon={faChevronDown} />}
        {!noChevron && !expanded && <FontAwesomeIcon icon={faChevronRight} />}
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
  )
}

export default AccordionTitle
