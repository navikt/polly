import { FileWordIcon, PlusCircleIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Heading, LocalAlert, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  convertDisclosureToFormValues,
  convertProcessToFormValues,
  createProcess,
  updateDisclosure,
} from '../api/GetAllApi'
import ModalProcess from '../components/Process/Accordion/ModalProcess'
import { IProcessFormValues } from '../constants'
import { CodelistService } from '../service/Codelist'
import { user } from '../service/User'
import { env } from '../util/env'
import { PurposeList } from './ListSearchPage'
import { ESection, genProcessPath } from './ProcessPage'

export const PurposeListPage = () => {
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()
  const [showCreateProcessModal, setShowCreateProcessModal] = useState(false)
  const [errorProcessModal, setErrorProcessModal] = useState(null)
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [exportDownloading, setExportDownloading] = useState<'internal' | 'external' | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)
  const [codelistUtils] = CodelistService()

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

  const handleExport = async (type: 'internal' | 'external') => {
    const url =
      type === 'internal'
        ? `${env.pollyBaseUrl}/export/process/allpurpose`
        : `${env.pollyBaseUrl}/export/process/allpurpose?documentAccess=EXTERNAL`

    setExportError(null)
    setExportSuccess(null)
    setExportDownloading(type)
    try {
      await downloadFile(url, `export-${type}.docx`)
      setExportSuccess(
        type === 'internal'
          ? 'Eksport for intern bruk lastet ned.'
          : 'Eksport for ekstern bruk lastet ned.'
      )
    } catch (e) {
      // Fallback to regular download navigation (works even if CORS prevents fetch)
      try {
        window.location.assign(url)
      } catch {
        const message = e instanceof Error ? e.message : 'Nedlasting feilet'
        setExportError(message)
      }
    } finally {
      setExportDownloading(null)
    }
  }

  const handleCreateProcess = async (process: IProcessFormValues) => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setErrorProcessModal(null)
      setShowCreateProcessModal(false)
      // todo multipurpose url
      navigate(
        genProcessPath(ESection.purpose, newProcess.purposes[0].code, newProcess, undefined, true)
      )
      process.disclosures.forEach((disclosureItem) => {
        updateDisclosure(
          convertDisclosureToFormValues({
            ...disclosureItem,
            processIds: [...disclosureItem.processIds, newProcess.id],
          })
        )
      })
    } catch (error: any) {
      setErrorProcessModal(error.message)
    }
  }

  return (
    <div role="main">
      <>
        <Heading size="xlarge">Behandlingsaktiviteter</Heading>
        <div className="flex w-full justify-between">
          <div>
            <BodyShort>Velg overordnet behandlingsaktivitet</BodyShort>
          </div>

          <div className="mt-auto flex items-center">
            {hasAccess() && (
              <Button
                className="mr-4"
                variant="secondary"
                icon={
                  <span className="flex items-center leading-none">
                    <FileWordIcon aria-hidden className="block" />
                  </span>
                }
                onClick={() => {
                  setExportError(null)
                  setExportSuccess(null)
                  setIsExportModalOpen(true)
                }}
              >
                Eksportér alle behandlinger
              </Button>
            )}

            {hasAccess() && (
              <Button
                variant="secondary"
                icon={
                  <span className="flex items-center leading-none">
                    <PlusCircleIcon aria-hidden className="block" />
                  </span>
                }
                onClick={() => setShowCreateProcessModal(true)}
              >
                Opprett ny behandling
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6" />

        <ModalProcess
          codelistUtils={codelistUtils}
          title="Opprett ny behandling"
          onClose={() => setShowCreateProcessModal(false)}
          isOpen={showCreateProcessModal}
          submit={(values: IProcessFormValues) => handleCreateProcess(values)}
          errorOnCreate={errorProcessModal}
          isEdit={false}
          initialValues={convertProcessToFormValues()}
        />

        <Modal
          header={{ heading: 'Velg eksport metode' }}
          open={isExportModalOpen}
          onClose={() => {
            if (!exportDownloading) {
              setIsExportModalOpen(false)
              setExportError(null)
              setExportSuccess(null)
            }
          }}
        >
          <Modal.Body>
            <div className="flex flex-wrap gap-3">
              <Button
                size="small"
                variant="secondary"
                icon={
                  <span className="flex items-center leading-none">
                    <FileWordIcon aria-hidden className="block" />
                  </span>
                }
                loading={exportDownloading === 'internal'}
                disabled={exportDownloading !== null}
                onClick={() => handleExport('internal')}
                type="button"
              >
                Eksport for intern bruk
              </Button>

              <Button
                size="small"
                variant="secondary"
                icon={
                  <span className="flex items-center leading-none">
                    <FileWordIcon aria-hidden className="block" />
                  </span>
                }
                loading={exportDownloading === 'external'}
                disabled={exportDownloading !== null}
                onClick={() => handleExport('external')}
                type="button"
              >
                Eksport for ekstern bruk
              </Button>
            </div>

            {exportSuccess && (
              <LocalAlert status="success" className="mt-3" role="status" aria-live="polite">
                <LocalAlert.Header>
                  <LocalAlert.Title>Eksport velykket</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>{exportSuccess}</LocalAlert.Content>
              </LocalAlert>
            )}
            {exportError && <BodyShort className="mt-3">{exportError}</BodyShort>}
          </Modal.Body>
        </Modal>

        <PurposeList />
      </>
    </div>
  )
}
