import { faFileWord } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '@navikt/ds-react'
import { Plus } from 'baseui/icon'
import { StyledLink } from 'baseui/link'
import { HeadingXXLarge, LabelLarge } from 'baseui/typography'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  convertDisclosureToFormValues,
  convertProcessToFormValues,
  createProcess,
  updateDisclosure,
} from '../api/GetAllApi'
import ModalProcess from '../components/Process/Accordion/ModalProcess'
import Button from '../components/common/Button/CustomButton'
import { IProcessFormValues } from '../constants'
import { ampli } from '../service/Amplitude'
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

  ampli.logEvent('besøk', {
    side: 'Behandlinger',
    url: '/process',
    app: 'Behandlingskatalogen',
    type: 'Velg overordnet behandlingsaktivitet',
  })

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
        <HeadingXXLarge>Behandlingsaktiviteter</HeadingXXLarge>

        <div className="flex w-full justify-between">
          <div>
            <LabelLarge>Velg overordnet behandlingsaktivitet</LabelLarge>
          </div>

          <div className="mt-auto flex items-center">
            {hasAccess() && (
              <Button
                onClick={() => setIsExportModalOpen(true)}
                kind="outline"
                size="xsmall"
                icon={faFileWord}
                marginRight
              >
                Eksportér alle behandlinger
              </Button>
            )}

            {hasAccess() && (
              <Button
                size="xsmall"
                kind={'outline'}
                onClick={() => setShowCreateProcessModal(true)}
                startEnhancer={
                  <div className="flex justify-center">
                    <Plus size={22} />
                  </div>
                }
              >
                Opprett ny behandling
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6" />

        <ModalProcess
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
            <StyledLink
              style={{ textDecoration: 'none' }}
              href={`${env.pollyBaseUrl}/export/process/allpurpose`}
            >
              <Button kind="outline" size="xsmall" icon={faFileWord} marginRight>
                Eksport for intern bruk
              </Button>
            </StyledLink>
            <StyledLink
              style={{ textDecoration: 'none' }}
              href={`${env.pollyBaseUrl}/export/process/allpurpose?documentAccess=EXTERNAL`}
            >
              <Button kind="outline" size="xsmall" icon={faFileWord} marginRight>
                Eksport for ekstern bruk
              </Button>
            </StyledLink>
          </Modal.Body>
        </Modal>

        <PurposeList />
      </>
    </div>
  )
}
