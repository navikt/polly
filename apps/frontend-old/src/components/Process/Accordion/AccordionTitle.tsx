import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Label, Tag } from '@navikt/ds-react'
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
      <Label className="text-(--a-text-default)" style={{ color: theme.colors.primary }}>
        {!noChevron && expanded && <ChevronDownIcon aria-hidden className="block" />}
        {!noChevron && !expanded && <ChevronRightIcon aria-hidden className="block" />}
        <span> </span>
        <Tag variant={isActive ? 'success' : 'warning'}>
          {isActive ? (
            <span className="inline-grid place-items-center">
              <span className="invisible col-start-1 row-start-1">Utgått</span>
              <span className="col-start-1 row-start-1">Aktiv</span>
            </span>
          ) : (
            'Utgått'
          )}
        </Tag>
        <span className="ml-2">
          {process.purposes
            .map((purpose: ICode) => codelistUtils.getShortname(EListName.PURPOSE, purpose.code))
            .join(', ')}
          :{' '}
        </span>
        <span>{process.name}</span>
      </Label>
    </div>
  )
}

export default AccordionTitle
