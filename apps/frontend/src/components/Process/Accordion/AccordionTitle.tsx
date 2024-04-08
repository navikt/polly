import { ProcessShort, ProcessStatus } from '../../../constants'
import { Block } from 'baseui/block'
import { LabelLarge } from 'baseui/typography'
import { intl, theme } from '../../../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faEdit, faFileWord, faTrash } from '@fortawesome/free-solid-svg-icons'
import { codelist, ListName } from '../../../service/Codelist'
import { AuditButton } from '../../audit/AuditButton'
import { StyledLink } from 'baseui/link'
import { env } from '../../../util/env'
import Button from '../../common/Button'
import { SIZE as ButtonSize } from 'baseui/button'
import * as React from 'react'
import { Modal, ModalBody, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Tag } from '@navikt/ds-react'

type AccordionTitleProps = {
  process: ProcessShort
  expanded: boolean
  hasAccess: boolean
  editProcess: () => void
  deleteProcess: () => void
  forwardRef?: React.Ref<any>
}

export const InformationTypeRef = React.createRef<HTMLDivElement>()

const AccordionTitle = (props: AccordionTitleProps) => {
  const { process, expanded, hasAccess } = props
  const [isExportModalOpen, setIsExportModalOpen] = React.useState<boolean>(false)
  const today = new Date().toISOString().split('T')[0]

  const isActive = today < process.end




  return (
    <>
      <Block ref={props.forwardRef}>
        <LabelLarge color={theme.colors.primary}>
          {expanded ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
          <span> </span>
          <Tag variant={isActive ? 'success' : 'warning'}>{isActive ? 'Aktiv' : 'Utgått'}</Tag>
          <span> </span>
          <span>{process.purposes.map((p) => codelist.getShortname(ListName.PURPOSE, p.code)).join(', ')}: </span>
          <span>{process.name}</span>
        </LabelLarge>
      </Block>
      <div
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {expanded && (
          <>
            <AuditButton id={process.id} marginRight />
            <Button onClick={() => setIsExportModalOpen(true)} kind={'outline'} size={ButtonSize.compact} icon={faFileWord} tooltip={intl.export} marginRight>
              {intl.export}
            </Button>
          </>
        )}

        <Modal closeable animate autoFocus size={SIZE.auto} role={ROLE.dialog} isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
          <ModalHeader>{intl.exportHeader}</ModalHeader>
          <ModalBody>
            <StyledLink style={{ textDecoration: 'none' }} href={`${env.pollyBaseUrl}/export/process?processId=${process.id}`}>
              <Button kind={'outline'} size={ButtonSize.compact} icon={faFileWord} tooltip={intl.export} marginRight>
                {intl.exportInternal}
              </Button>
            </StyledLink>
            <StyledLink style={{ textDecoration: 'none' }} href={`${env.pollyBaseUrl}/export/process?processId=${process.id}&documentAccess=EXTERNAL`}>
              <Button kind={'outline'} size={ButtonSize.compact} icon={faFileWord} tooltip={intl.export} marginRight disabled={process.status !== ProcessStatus.COMPLETED}>
                {intl.exportExternal}
              </Button>
            </StyledLink>
          </ModalBody>
        </Modal>

        {hasAccess && expanded && (
          <>
            <Button kind={'outline'} size={ButtonSize.compact} icon={faEdit} tooltip={intl.edit} onClick={props.editProcess} marginRight>
              {intl.edit}
            </Button>

            <Button
              kind={'outline'}
              size={ButtonSize.compact}
              icon={faEdit}
              tooltip={intl.editInformationTypes}
              onClick={() => {
                if (InformationTypeRef && InformationTypeRef.current) {
                  InformationTypeRef.current.scrollIntoView()
                }
              }}
              marginRight
            >
              {intl.editInformationTypes}
            </Button>

            <Button kind={'outline'} size={ButtonSize.compact} icon={faTrash} tooltip={intl.delete} onClick={props.deleteProcess}>
              {intl.delete}
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default AccordionTitle
