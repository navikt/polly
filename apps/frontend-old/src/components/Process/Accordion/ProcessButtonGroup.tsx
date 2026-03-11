import { DocPencilIcon, FileWordIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyLong, Loader, Modal } from '@navikt/ds-react'
import axios from 'axios'
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
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false)
  const [exportError, setExportError] = useState<string>('')

  const handleExport = async (exportUrl: string) => {
    setIsExportLoading(true)
    setExportError('')
    await axios
      .get(exportUrl)
      .then(() => {
        window.location.href = exportUrl
        setIsExportModalOpen(false)
      })
      .catch((error: any) => {
        setExportError(error.response.data.message)
      })
      .finally(() => {
        setIsExportLoading(false)
      })
  }

  return (
    <div className="flex flex-wrap justify-end gap-2 mb-3">
      <AuditButton id={process.id} />
      <Button
        onClick={() => setIsExportModalOpen(true)}
        kind="outline"
        size="xsmall"
        icon={
          <span className="flex items-center leading-none">
            <FileWordIcon aria-hidden className="block" />
          </span>
        }
      >
        Eksportér
      </Button>

      {isExportModalOpen && (
        <Modal
          open={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          header={{ heading: 'Velg eksportmetode' }}
        >
          <Modal.Body>
            {exportError !== '' && <BodyLong>{exportError}</BodyLong>}
            {isExportLoading && (
              <div className="flex w-full justify-center">
                <Loader size="3xlarge" />
              </div>
            )}
            {!isExportLoading && exportError === '' && (
              <div className="flex gap-2">
                <Button
                  kind="outline"
                  size="xsmall"
                  icon={
                    <span className="flex items-center leading-none">
                      <FileWordIcon aria-hidden className="block" />
                    </span>
                  }
                  onClick={async () => {
                    await handleExport(`${env.pollyBaseUrl}/export/process?processId=${process.id}`)
                  }}
                >
                  Eksport for intern bruk
                </Button>
                <Button
                  kind="outline"
                  size="xsmall"
                  icon={
                    <span className="flex items-center leading-none">
                      <FileWordIcon aria-hidden className="block" />
                    </span>
                  }
                  disabled={process.status !== EProcessStatus.COMPLETED}
                  onClick={async () => {
                    await handleExport(
                      `${env.pollyBaseUrl}/export/process?processId=${process.id}&documentAccess=EXTERNAL`
                    )
                  }}
                >
                  Eksport for ekstern bruk
                </Button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}

      {hasAccess && (
        <>
          <Button
            kind="outline"
            size="xsmall"
            icon={
              <span className="flex items-center leading-none">
                <DocPencilIcon aria-hidden className="block" />
              </span>
            }
            onClick={editProcess}
          >
            Redigér
          </Button>

          <Button
            kind="outline"
            size="xsmall"
            icon={
              <span className="flex items-center leading-none">
                <DocPencilIcon aria-hidden className="block" />
              </span>
            }
            onClick={() => {
              if (InformationTypeRef && InformationTypeRef.current) {
                InformationTypeRef.current.scrollIntoView()
              }
            }}
          >
            Rediger opplysningstyper
          </Button>

          <Button
            kind="outline"
            size="xsmall"
            icon={
              <span className="flex items-center leading-none">
                <TrashIcon aria-hidden className="block" />
              </span>
            }
            onClick={deleteProcess}
          >
            Slett
          </Button>
        </>
      )}
    </div>
  )
}
