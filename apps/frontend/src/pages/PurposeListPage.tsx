import { SIZE as ButtonSize } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { HeadingXXLarge, LabelLarge } from 'baseui/typography'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { convertDisclosureToFormValues, convertProcessToFormValues, createProcess, updateDisclosure } from '../api'
import Button from '../components/common/Button'
import ModalProcess from '../components/Process/Accordion/ModalProcess'
import { ProcessFormValues } from '../constants'
import { ampli } from '../service/Amplitude'
import { user } from '../service/User'
import { PurposeList } from './ListSearchPage'
import { genProcessPath, Section } from './ProcessPage'

export const PurposeListPage = () => {
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState(null)

  ampli.logEvent('besøk', { side: 'Behandlinger', url: '/process', app: 'Behandlingskatalogen', type: 'Velg overordnet behandlingsaktivitet' })

  const handleCreateProcess = async (process: ProcessFormValues) => {
    if (!process) return
    try {
      const newProcess = await createProcess(process)
      setErrorProcessModal(null)
      setShowCreateProcessModal(false)
      // todo multipurpose url
      navigate(genProcessPath(Section.purpose, newProcess.purposes[0].code, newProcess, undefined, true))
      process.disclosures.forEach((d) => {
        updateDisclosure(convertDisclosureToFormValues({ ...d, processIds: [...d.processIds, newProcess.id] }))
      })
    } catch (err: any) {
      setErrorProcessModal(err.message)
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

          <div className="mt-auto">
            {hasAccess() && (
              <Button
                size={ButtonSize.compact}
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
          submit={(values: ProcessFormValues) => handleCreateProcess(values)}
          errorOnCreate={errorProcessModal}
          isEdit={false}
          initialValues={convertProcessToFormValues()}
        />
        <PurposeList />
      </>
    </div>
  )
}
