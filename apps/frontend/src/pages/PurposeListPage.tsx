import { faFileWord, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyShort, Button, Heading, Link, Modal } from '@navikt/ds-react'
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
  const [codelistUtils] = CodelistService()

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
                onClick={() => setIsExportModalOpen(true)}
              >
                <FontAwesomeIcon icon={faFileWord} />
                &nbsp;Eksportér alle behandlinger
              </Button>
            )}

            {hasAccess() && (
              <Button variant="secondary" onClick={() => setShowCreateProcessModal(true)}>
                <FontAwesomeIcon icon={faPlusCircle} />
                &nbsp;Opprett ny behandling
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
          onClose={() => setIsExportModalOpen(false)}
        >
          <Modal.Body>
            <Link className="mr-4" href={`${env.pollyBaseUrl}/export/process/allpurpose`}>
              <Button size="small" variant="secondary">
                <FontAwesomeIcon icon={faFileWord} />
                &nbsp;Eksport for intern bruk
              </Button>
            </Link>
            <Link href={`${env.pollyBaseUrl}/export/process/allpurpose?documentAccess=EXTERNAL`}>
              <Button size="small" variant="secondary">
                <FontAwesomeIcon icon={faFileWord} />
                &nbsp;Eksport for ekstern bruk
              </Button>
            </Link>
          </Modal.Body>
        </Modal>

        <PurposeList />
      </>
    </div>
  )
}
