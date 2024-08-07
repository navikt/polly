import { BodyShort, Spacer, Tabs } from '@navikt/ds-react'
import { Button, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { HeadingXLarge } from 'baseui/typography'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { createDisclosure, deleteDisclosure, updateDisclosure } from '../../api'
import { Disclosure, DisclosureFormValues, ProcessStatus } from '../../constants'
import { Section } from '../../pages/ProcessPage'
import { ListName } from '../../service/Codelist'
import { user } from '../../service/User'
import ProcessList from '../Process/ProcessList'
import AccordionDisclosure from '../ThirdParty/AccordionDisclosure'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'

interface IProps {
  disclosureData: Disclosure[]
  setDisclosureData: Dispatch<SetStateAction<Disclosure[]>>
  code: string
  section: Section
  isEditable: boolean
  moveScroll?: Function
  listName?: ListName
  processId?: string
  filter?: ProcessStatus
  thirdTabTitle?: string
  thirdTabContent?: ReactNode
}

export const ProcessDisclosureTabs = (props: IProps) => {
  const { disclosureData, setDisclosureData, code, listName, processId, filter, section, moveScroll, isEditable, thirdTabTitle, thirdTabContent } = props
  const [error, setError] = useState<string>()
  const [showCreateDisclosureModal, setShowCreateDisclosureModal] = useState<boolean>(false)

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues): Promise<void> => {
    try {
      let createdDisclosure: Disclosure = await createDisclosure(disclosure)

      if (!disclosureData || disclosureData.length < 1) setDisclosureData([createdDisclosure])
      else if (disclosureData && createdDisclosure) setDisclosureData([...disclosureData, createdDisclosure])

      setShowCreateDisclosureModal(false)
    } catch (error: any) {
      setShowCreateDisclosureModal(true)
      setError(error.message)
    }
  }

  const handleEditDisclosure = async (disclosure: DisclosureFormValues): Promise<boolean> => {
    try {
      let editedDisclosure = await updateDisclosure(disclosure)

      const newDisclosureData: Disclosure[] = disclosureData.map((disclosure: Disclosure) => {
        if (disclosure.id === editedDisclosure.id) {
          return editedDisclosure
        } else return disclosure
      })

      setDisclosureData(newDisclosureData)

      return true
    } catch (error: any) {
      setError(error.message)
      return false
    }
  }

  const handleDeleteDisclosure = async (disclosure: Disclosure): Promise<boolean> => {
    if (!disclosure) return false

    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureData([...disclosureData.filter((disclosureData: Disclosure) => disclosureData.id !== disclosure.id)])
      setError(undefined)
      return true
    } catch (error: any) {
      setError(error.message)
      return false
    }
  }

  const initialFormValues: DisclosureFormValues = {
    name: '',
    recipient: '',
    recipientPurpose: '',
    description: '',
    document: undefined,
    legalBases: [],
    legalBasesOpen: false,
    start: undefined,
    end: undefined,
    processes: [],
    abroad: { abroad: false, countries: [], refToAgreement: '', businessArea: '' },
    processIds: [],
    administrationArchiveCaseNumber: '',
    assessedConfidentiality: undefined,
    confidentialityDescription: '',
  }

  return (
    <Tabs defaultValue="behandlinger">
      <Tabs.List>
        <Tabs.Tab value="behandlinger" label="Behandlinger" />
        <Tabs.Tab value="utleveringer" label="Utleveringer" />
        {thirdTabTitle && <Tabs.Tab value={thirdTabTitle} label={thirdTabTitle} />}
      </Tabs.List>
      <Tabs.Panel value="behandlinger">
        <div className="my-2">
          <ProcessList code={code} listName={listName} processId={processId} filter={filter} section={section} moveScroll={moveScroll} isEditable={isEditable} />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="utleveringer">
        <div className="my-2">
          <div className="flex">
            <HeadingXLarge>Utleveringer ({disclosureData ? disclosureData.length : 0})</HeadingXLarge>
            <Spacer />
            {isEditable && (
              <div className="flex justify-end">
                {user.canWrite() && (
                  <Button
                    size="compact"
                    kind={KIND.tertiary}
                    onClick={() => setShowCreateDisclosureModal(true)}
                    startEnhancer={() => (
                      <div className="flex justify-center">
                        <Plus size={22} />
                      </div>
                    )}
                  >
                    Opprett ny utlevering
                  </Button>
                )}
              </div>
            )}
          </div>

          {disclosureData.length === 0 && <BodyShort className="my-4">Ingen utleveringer</BodyShort>}

          {disclosureData.length > 0 && (
            <AccordionDisclosure
              disclosureList={disclosureData}
              showRecipient={true}
              errorModal={error}
              editable={isEditable}
              submitDeleteDisclosure={handleDeleteDisclosure}
              submitEditDisclosure={handleEditDisclosure}
              onCloseModal={() => setError(undefined)}
            />
          )}

          <ModalThirdParty
            title="Opprett utlevering til ekstern part"
            isOpen={showCreateDisclosureModal}
            initialValues={initialFormValues}
            submit={handleCreateDisclosure}
            onClose={() => {
              setShowCreateDisclosureModal(false)
              setError(undefined)
            }}
            errorOnCreate={error}
          />
        </div>
      </Tabs.Panel>
      {thirdTabTitle && thirdTabContent && <Tabs.Panel value={thirdTabTitle}>{thirdTabContent}</Tabs.Panel>}
    </Tabs>
  )
}

export default ProcessDisclosureTabs
