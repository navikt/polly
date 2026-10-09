'use client'

import { PlusIcon } from '@navikt/aksel-icons'
import { Label, Select } from '@navikt/ds-react'
import { useParams } from 'next/navigation'
import { ChangeEvent, FunctionComponent, SetStateAction, useContext } from 'react'
import Button from '@/components/common/Button/CustomButton'
import { ESection, TPathParams, listNameForSection } from '@/components/mainPages/ProcessPage'
import { EProcessStatus, IProcess } from '@/constants'
import { UserContext } from '@/provider/userProvider'
import { genProcessPath, genUnderordnetProcessPath } from '@/util/processUtils'
import { useNavigate } from '@/util/router'
import { theme } from '@/util/theme'
import ExportProcessModal from '../Export/ExportProcessModal'

type TProps = {
  isEditable: boolean
  exportHref: string
  setErrorProcessModal: (value: string) => void
  setCreateProcessModalKey: (value: SetStateAction<number>) => void
  setShowCreateProcessModal: (value: boolean) => void
  forUnderordnetBehandling: boolean
  filter?: EProcessStatus
  process?: IProcess
}

const ProcessPageButtonGroup: FunctionComponent<TProps> = ({
  isEditable,
  exportHref,
  setErrorProcessModal,
  setCreateProcessModalKey,
  setShowCreateProcessModal,
  forUnderordnetBehandling,
  filter,
  process,
}) => {
  const params = useParams<TPathParams>()
  const { section, code } = params
  const navigate = useNavigate()
  const user = useContext(UserContext)

  const hasAccess = (): boolean => user.canWrite() || user.isAdmin()
  const listName = listNameForSection(section)

  const navCode = section === ESection.department && !code ? 'Ingen avdeling' : code

  return (
    <div className='flex flex-wrap items-center gap-2 w-full sm:w-auto'>
      <Label style={{ color: theme.colors.primary, marginRight: '1rem' }}>Filter</Label>

      <div className='w-full sm:w-72 min-w-0'>
        <Select
          label='Status filter'
          hideLabel
          value={filter ?? ''}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            let path = ''
            if (forUnderordnetBehandling && process) {
              path = genUnderordnetProcessPath(
                section,
                navCode,
                process,
                undefined,
                event.target.value as EProcessStatus | undefined
              )
            } else {
              path = genProcessPath(
                section,
                navCode,
                process,
                event.target.value as EProcessStatus | undefined
              )
            }
            navigate(path, { scroll: false })
          }}
        >
          <option value=''>Alle behandlinger</option>
          <option value={EProcessStatus.IN_PROGRESS}>Behandlinger under arbeid</option>
          <option value={EProcessStatus.NEEDS_REVISION}>Trenger revidering</option>
          <option value={EProcessStatus.COMPLETED}>Ferdig dokumenterte behandlinger</option>
        </Select>
      </div>

      <div className='flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto'>
        <ExportProcessModal
          listName={listName}
          code={code}
          marginRight={true}
          exportHref={exportHref}
        />
        {isEditable && hasAccess() && (
          <Button
            size='xsmall'
            kind='tertiary'
            icon={
              <span className='flex items-center leading-none'>
                <PlusIcon aria-hidden className='block' />
              </span>
            }
            onClick={() => {
              setErrorProcessModal('')
              setCreateProcessModalKey((k) => k + 1)
              setShowCreateProcessModal(true)
            }}
          >
            Opprett ny {forUnderordnetBehandling ? 'underordnet ' : ''}behandling
          </Button>
        )}
      </div>
    </div>
  )
}
export default ProcessPageButtonGroup
