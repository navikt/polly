import { theme } from '../util'
import { HeadingXXLarge, LabelLarge } from 'baseui/typography'
import React from 'react'
import { Block } from 'baseui/block'
import { SIZE as ButtonSize } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { user } from '../service/User'
import ModalProcess from '../components/Process/Accordion/ModalProcess'
import { ProcessFormValues } from '../constants'
import { convertDisclosureToFormValues, convertProcessToFormValues, createProcess, updateDisclosure } from '../api'
import { useNavigate } from 'react-router-dom'
import { genProcessPath, Section } from './ProcessPage'
import Button from '../components/common/Button'
import { PurposeList } from './ListSearchPage'
import {ampli} from "../service/Amplitude";

export const PurposeListPage = () => {
  const navigate = useNavigate()
  const hasAccess = () => user.canWrite()
  const [showCreateProcessModal, setShowCreateProcessModal] = React.useState(false)
  const [errorProcessModal, setErrorProcessModal] = React.useState(null)

  ampli.logEvent("besøk", {side: 'Behandlinger', url: '/process', app: 'Behandlingskatalogen', type: 'Velg overordnet behandlingsaktivitet'})

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
    <Block overrides={{ Block: { props: { role: 'main' } } }}>
      <>
        <HeadingXXLarge>Behandlingsaktiviteter</HeadingXXLarge>

        <Block display={'flex'} width={'100%'} justifyContent={'space-between'}>
          <Block>
            <LabelLarge>Velg overordnet behandlingsaktivitet</LabelLarge>
          </Block>

          <Block marginTop={'auto'}>
            {hasAccess() && (
              <Button
                size={ButtonSize.compact}
                kind={'outline'}
                onClick={() => setShowCreateProcessModal(true)}
                startEnhancer={
                  <Block display="flex" justifyContent="center">
                    <Plus size={22} />
                  </Block>
                }
              >
                Opprett ny behandling
              </Button>
            )}
          </Block>
        </Block>

        <Block marginBottom={theme.sizing.scale800} />

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
    </Block>
  )
}
