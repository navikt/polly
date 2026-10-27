'use client'

import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Heading, Tag } from '@navikt/ds-react'
import { Ref, useEffect, useState } from 'react'
import { EListName, ICode } from '@/constants/codelistConstant'
import { ICodelistProps } from '@/provider/kodeverkProvider'
import { checkForAvvik } from '@/util/processUtils'
import { theme } from '@/util/theme'
import { EBehandlingsNivaa, IProcess, IProcessShort } from '../../../constants'

type TAccordionTitleProps = {
  codelistUtils: ICodelistProps
  process: IProcessShort
  expanded: boolean
  forwardRef?: Ref<any>
  noChevron?: boolean
  forUnderordnetBehandlinger: boolean
  overordnetBehandling?: IProcess
}

const AccordionTitle = (props: TAccordionTitleProps) => {
  const {
    process,
    expanded,
    forwardRef,
    codelistUtils,
    noChevron,
    forUnderordnetBehandlinger,
    overordnetBehandling,
  } = props
  const [isAvvik, setIsAvvik] = useState<boolean>()
  const today: string = new Date().toISOString().split('T')[0]

  const isActive: boolean = today < process.end

  useEffect(() => {
    ;(async () => {
      if (forUnderordnetBehandlinger && overordnetBehandling) {
        await checkForAvvik(overordnetBehandling, process).then(setIsAvvik)
      }
    })()
  }, [forUnderordnetBehandlinger, overordnetBehandling])

  return (
    <div ref={forwardRef}>
      <Heading
        className='text-(--a-text-default)'
        style={{ color: theme.colors.primary }}
        level='3'
        size='xsmall'
      >
        {!noChevron && expanded && <ChevronDownIcon aria-hidden className='block' />}
        {!noChevron && !expanded && <ChevronRightIcon aria-hidden className='block' />}
        <span> </span>
        <Tag variant={isActive ? 'success' : 'warning'}>
          {isActive ? (
            <span className='inline-grid place-items-center'>
              <span className='invisible col-start-1 row-start-1'>Utgått</span>
              <span className='col-start-1 row-start-1'>Aktiv</span>
            </span>
          ) : (
            'Utgått'
          )}
        </Tag>
        <span className='ml-2'>
          {process.purposes
            .map((purpose: ICode) => codelistUtils.getShortname(EListName.PURPOSE, purpose.code))
            .join(', ')}
          :{' '}
        </span>
        <span>{process.name}</span>
        {process.behandlingsNivaa === EBehandlingsNivaa.OVERORDNET && (
          <Tag className='ml-3' variant='outline' data-color='danger'>
            Overordnet behandling
          </Tag>
        )}
        {process.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET && (
          <Tag className='ml-3' variant='outline' data-color='brand-beige'>
            Underordnet behandling
          </Tag>
        )}

        {isAvvik && (
          <Tag className='ml-3' variant='outline' data-color='meta-purple'>
            Endringer fra overordnet
          </Tag>
        )}
      </Heading>
    </div>
  )
}

export default AccordionTitle
