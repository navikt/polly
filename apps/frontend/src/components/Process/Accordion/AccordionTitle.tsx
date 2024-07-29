import { faChevronDown, faChevronRight, faEdit, faFileWord, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tag } from '@navikt/ds-react'
import { SIZE as ButtonSize } from 'baseui/button'
import { StyledLink } from 'baseui/link'
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { LabelLarge } from 'baseui/typography'
import { Ref, createRef, useState } from 'react'
import { ProcessShort, ProcessStatus } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'
import { theme } from '../../../util'
import { env } from '../../../util/env'
import { AuditButton } from '../../admin/audit/AuditButton'
import Button from '../../common/Button'

type AccordionTitleProps = {
  process: ProcessShort
  expanded: boolean
  hasAccess: boolean
  editProcess: () => void
  deleteProcess: () => void
  forwardRef?: Ref<any>
}

export const InformationTypeRef = createRef<HTMLDivElement>()

const AccordionTitle = (props: AccordionTitleProps) => {
  const { process, expanded, hasAccess, forwardRef } = props
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const today = new Date().toISOString().split('T')[0]

  const isActive = today < process.end

  return (
    <>
      <div ref={forwardRef}>
        <LabelLarge color={theme.colors.primary}>
          {expanded ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
          <span> </span>
          <Tag variant={isActive ? 'success' : 'warning'}>{isActive ? 'Aktiv' : 'Utgått'}</Tag>
          <span> </span>
          <span>{process.purposes.map((p) => codelist.getShortname(ListName.PURPOSE, p.code)).join(', ')}: </span>
          <span>{process.name}</span>
        </LabelLarge>
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        {expanded && (
          <>
            <AuditButton id={process.id} marginRight />
            <Button onClick={() => setIsExportModalOpen(true)} kind={'outline'} size={ButtonSize.compact} icon={faFileWord} marginRight>
              Eksportér
            </Button>
          </>
        )}

        <Modal closeable animate autoFocus size={SIZE.auto} role={ROLE.dialog} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
          <ModalHeader>Velg eksportmetode</ModalHeader>
          <ModalBody>
            <StyledLink style={{ textDecoration: 'none' }} href={`${env.pollyBaseUrl}/export/process?processId=${process.id}`}>
              <Button kind={'outline'} size={ButtonSize.compact} icon={faFileWord} marginRight>
                Eksport for intern bruk
              </Button>
            </StyledLink>
            <StyledLink style={{ textDecoration: 'none' }} href={`${env.pollyBaseUrl}/export/process?processId=${process.id}&documentAccess=EXTERNAL`}>
              <Button kind={'outline'} size={ButtonSize.compact} icon={faFileWord} marginRight disabled={process.status !== ProcessStatus.COMPLETED}>
                Eksport for ekstern bruk
              </Button>
            </StyledLink>
          </ModalBody>
        </Modal>

        {hasAccess && expanded && (
          <>
            <Button kind={'outline'} size={ButtonSize.compact} icon={faEdit} onClick={props.editProcess} marginRight>
              Redigér
            </Button>

            <Button
              kind={'outline'}
              size={ButtonSize.compact}
              icon={faEdit}
              onClick={() => {
                if (InformationTypeRef && InformationTypeRef.current) {
                  InformationTypeRef.current.scrollIntoView()
                }
              }}
              marginRight
            >
              Rediger opplysningstyper
            </Button>

            <Button kind={'outline'} size={ButtonSize.compact} icon={faTrash} onClick={props.deleteProcess}>
              Slett
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default AccordionTitle
