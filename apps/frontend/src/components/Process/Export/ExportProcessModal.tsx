import { faFileWord } from '@fortawesome/free-solid-svg-icons'
import { BodyLong, Loader, Modal } from '@navikt/ds-react'
import axios from 'axios'
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
        onClick={() => setIsExportModalOpen(true)}
        kind="outline"
        size="xsmall"
        icon={faFileWord}
        marginRight={marginRight}
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
            {isExportLoading && <Loader size="large" className="flex justify-self-center" />}
            {!isExportLoading && exportError === '' && (
              <>
                <Button
                  kind="outline"
                  size="xsmall"
                  icon={faFileWord}
                  marginRight
                  onClick={async () => {
                    const exportUrl = exportHref
                      ? exportHref
                      : `${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}`
                    await handleExport(exportUrl)
                  }}
                >
                  Eksport for intern bruk
                </Button>
                <Button
                  kind="outline"
                  size="xsmall"
                  icon={faFileWord}
                  marginRight
                  onClick={async () => {
                    const exportUrl = exportHref
                      ? exportHref
                      : `${env.pollyBaseUrl}/export/process?${listNameToUrl()}=${code}&documentAccess=EXTERNAL`
                    await handleExport(exportUrl)
                  }}
                >
                  Eksport for ekstern bruk
                </Button>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}
export default ExportProcessModal
