import { FileWordIcon } from '@navikt/aksel-icons'
import { BodyLong, Loader, LocalAlert, Modal } from '@navikt/ds-react'
import { FunctionComponent, useState } from 'react'
import { EListName } from '../../../service/Codelist'
import { env } from '../../../util/env'
import Button from '../../common/Button/CustomButton'

type TProps = {
  code: string
  listName?: EListName
  marginRight?: boolean
  exportHref?: string
}

export const ExportProcessModal: FunctionComponent<TProps> = ({
  code,
  listName,
  marginRight,
  exportHref,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false)
  const [exportError, setExportError] = useState<string>('')
  const [exportSuccess, setExportSuccess] = useState<string>('')

  const downloadFile = async (url: string, fallbackFilename: string) => {
    const response = await fetch(url, { credentials: 'include' })
    if (!response.ok) {
      throw new Error(`Nedlasting feilet (${response.status})`)
    }

    const contentDisposition = response.headers.get('content-disposition')
    const filenameMatch = contentDisposition?.match(
      /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/
    )
    const filename = decodeURIComponent(
      filenameMatch?.[1] ?? filenameMatch?.[2] ?? fallbackFilename
    )

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(blobUrl)
  }

  const handleExport = async (exportUrl: string, type: 'internal' | 'external') => {
    setIsExportLoading(true)
    setExportError('')
    setExportSuccess('')
    try {
      await downloadFile(exportUrl, 'export.docx')
      setExportSuccess(
        type === 'internal'
          ? 'Eksport for intern bruk lastet ned.'
          : 'Eksport for ekstern bruk lastet ned.'
      )
    } catch (e) {
      // Fallback to regular download navigation (works even if fetch is blocked)
      try {
        window.location.assign(exportUrl)
      } catch {
        const message = e instanceof Error ? e.message : 'Nedlasting feilet'
        setExportError(message)
      }
    } finally {
      setIsExportLoading(false)
    }
  }

  const listNameToUrl = () =>
    listName &&
    (
      {
        DEPARTMENT: 'department',
        SUB_DEPARTMENT: 'subDepartment',
        PURPOSE: 'purpose',
        SYSTEM: 'system',
        DATA_PROCESSOR: 'processor',
        THIRD_PARTY: 'thirdparty',
      } as { [l: string]: string }
    )[listName]

  return (
    <>
      <Button
        onClick={() => {
          setExportError('')
          setExportSuccess('')
          setIsExportModalOpen(true)
        }}
        kind="outline"
        size="xsmall"
        icon={
          <span className="flex items-center leading-none">
            <FileWordIcon aria-hidden className="block" />
          </span>
        }
        marginRight={marginRight}
      >
        Eksportér
      </Button>
      {isExportModalOpen && (
        <Modal
          open={isExportModalOpen}
          onClose={() => {
            if (!isExportLoading) {
              setIsExportModalOpen(false)
              setExportError('')
              setExportSuccess('')
            }
          }}
          header={{ heading: 'Velg eksportmetode' }}
        >
          <Modal.Body>
            {exportError !== '' && <BodyLong>{exportError}</BodyLong>}
            {isExportLoading && <Loader size="large" className="flex justify-self-center" />}
            {!isExportLoading && exportError === '' && (
              <>
                <Button
                  kind="outline"
                  size="xsmall"
                  icon={
                    <span className="flex items-center leading-none">
                      <FileWordIcon aria-hidden className="block" />
                    </span>
                  }
                  marginRight
                  onClick={async () => {
                    const exportUrl = exportHref
                      ? exportHref
                      : `${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}`
                    await handleExport(exportUrl, 'internal')
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
                  marginRight
                  onClick={async () => {
                    const exportUrl = exportHref
                      ? exportHref
                      : `${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}&documentAccess=EXTERNAL`
                    await handleExport(exportUrl, 'external')
                  }}
                >
                  Eksport for ekstern bruk
                </Button>
              </>
            )}

            {exportSuccess !== '' && (
              <LocalAlert status="success" className="mt-3" role="status" aria-live="polite">
                <LocalAlert.Header>
                  <LocalAlert.Title>Eksport velykket</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>{exportSuccess}</LocalAlert.Content>
              </LocalAlert>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}
export default ExportProcessModal
