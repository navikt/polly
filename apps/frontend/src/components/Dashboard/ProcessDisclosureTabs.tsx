import { BodyShort, Spacer, Tabs } from '@navikt/ds-react'
import { Block } from 'baseui/block'
import { Button, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { HeadingXLarge } from 'baseui/typography'
import { ReactNode, useState } from 'react'
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
  setDisclosureData: React.Dispatch<React.SetStateAction<Disclosure[]>>
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

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let createdDisclosure = await createDisclosure(disclosure)

      if (!disclosureData || disclosureData.length < 1) setDisclosureData([createdDisclosure])
      else if (disclosureData && createdDisclosure) setDisclosureData([...disclosureData, createdDisclosure])

      setShowCreateDisclosureModal(false)
    } catch (err: any) {
      setShowCreateDisclosureModal(true)
      setError(err.message)
    }
  }

  const handleEditDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let editedDisclosure = await updateDisclosure(disclosure)

      const newDisclosureData = disclosureData.map((d: Disclosure) => {
        if (d.id === editedDisclosure.id) {
          return editedDisclosure
        } else return d
      })

      setDisclosureData(newDisclosureData)

      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const handleDeleteDisclosure = async (disclosure: Disclosure) => {
    if (!disclosure) return false
    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureData([...disclosureData.filter((d: Disclosure) => d.id !== disclosure.id)])
      setError(undefined)
      return true
    } catch (err: any) {
      setError(err.message)
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
              <Block display="flex" justifyContent="flex-end">
                {user.canWrite() && (
                  <Button
                    size="compact"
                    kind={KIND.tertiary}
                    onClick={() => setShowCreateDisclosureModal(true)}
                    startEnhancer={() => (
                      <Block display="flex" justifyContent="center">
                        <Plus size={22} />
                      </Block>
                    )}
                  >
                    Opprett ny utlevering
                  </Button>
                )}
              </Block>
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
