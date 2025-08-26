import { faEdit, faFileWord, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '@navikt/ds-react'
import { StyledLink } from 'baseui/link'
import { useState } from 'react'
import { EProcessStatus, IProcessShort } from '../../../constants'
import { env } from '../../../util/env'
import { AuditButton } from '../../admin/audit/AuditButton'
import Button from '../../common/Button/CustomButton'
import { InformationTypeRef } from './AccordionTitle'

interface IProcessButtonGroupProps {
  process: IProcessShort
  hasAccess: boolean
  editProcess: () => void
  deleteProcess: () => void
}

export const ProcessButtonGroup = (props: IProcessButtonGroupProps) => {
  const { process, hasAccess, editProcess, deleteProcess } = props
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)

  return (
    <div className="flex justify-end mb-3">
      <AuditButton id={process.id} marginRight />
      <Button
        onClick={() => setIsExportModalOpen(true)}
        kind="outline"
        size="xsmall"
        icon={faFileWord}
        marginRight
      >
        Eksportér
      </Button>

      <Modal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        header={{ heading: 'Velg eksportmetode' }}
      >
        <Modal.Body>
          <StyledLink
            style={{ textDecoration: 'none' }}
            href={`${env.pollyBaseUrl}/export/process?processId=${process.id}`}
          >
            <Button kind="outline" size="xsmall" icon={faFileWord} marginRight>
              Eksport for intern bruk
            </Button>
          </StyledLink>
          <StyledLink
            style={{ textDecoration: 'none' }}
            href={`${env.pollyBaseUrl}/export/process?processId=${process.id}&documentAccess=EXTERNAL`}
          >
            <Button
              kind="outline"
              size="xsmall"
              icon={faFileWord}
              marginRight
              disabled={process.status !== EProcessStatus.COMPLETED}
            >
              Eksport for ekstern bruk
            </Button>
          </StyledLink>
        </Modal.Body>
      </Modal>

      {hasAccess && (
        <>
          <Button kind="outline" size="xsmall" icon={faEdit} onClick={editProcess} marginRight>
            Redigér
          </Button>

          <Button
            kind="outline"
            size="xsmall"
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

          <Button kind="outline" size="xsmall" icon={faTrash} onClick={deleteProcess}>
            Slett
          </Button>
        </>
      )}
    </div>
  )
}
