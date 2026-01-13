import { BodyShort, Heading, Spacer, Tabs } from '@navikt/ds-react'
import { Button, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { createDisclosure, deleteDisclosure, updateDisclosure } from '../../api/GetAllApi'
import { EProcessStatus, IDisclosure, IDisclosureFormValues, IDpProcess } from '../../constants'
import { ESection } from '../../pages/ProcessPage'
import { EListName } from '../../service/Codelist'
import { user } from '../../service/User'
import DpProcessTable from '../DpProcess/DpProcessTable'
import ProcessList from '../Process/ProcessList'
import AccordionDisclosure from '../ThirdParty/AccordionDisclosure'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'

interface IProps {
  disclosureData: IDisclosure[]
  setDisclosureData: Dispatch<SetStateAction<IDisclosure[]>>
  dpProcessData: IDpProcess[]
  code: string
  section: ESection
  isEditable: boolean
  moveScroll?: () => void
  listName?: EListName
  processId?: string
  filter?: EProcessStatus
  thirdTabTitle?: string
  thirdTabContent?: ReactNode
}

export const ProcessDisclosureTabs = (props: IProps) => {
  const {
    disclosureData,
    setDisclosureData,
    code,
    listName,
    processId,
    filter,
    section,
    moveScroll,
    isEditable,
    thirdTabTitle,
    thirdTabContent,
    dpProcessData,
  } = props
  const [error, setError] = useState<string>()
  const [showCreateDisclosureModal, setShowCreateDisclosureModal] = useState<boolean>(false)

  const handleCreateDisclosure = async (disclosure: IDisclosureFormValues): Promise<void> => {
    try {
      const createdDisclosure: IDisclosure = await createDisclosure(disclosure)

      if (!disclosureData || disclosureData.length < 1) setDisclosureData([createdDisclosure])
      else if (disclosureData && createdDisclosure)
        setDisclosureData([...disclosureData, createdDisclosure])

      setShowCreateDisclosureModal(false)
    } catch (error: any) {
      setShowCreateDisclosureModal(true)
      setError(error.message)
    }
  }

  const handleEditDisclosure = async (disclosure: IDisclosureFormValues): Promise<boolean> => {
    try {
      const editedDisclosure = await updateDisclosure(disclosure)

      const newDisclosureData: IDisclosure[] = disclosureData.map((disclosure: IDisclosure) => {
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

  const handleDeleteDisclosure = async (disclosure: IDisclosure): Promise<boolean> => {
    if (!disclosure) return false

    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureData([
        ...disclosureData.filter(
          (disclosureData: IDisclosure) => disclosureData.id !== disclosure.id
        ),
      ])
      setError(undefined)
      return true
    } catch (error: any) {
      setError(error.message)
      return false
    }
  }

  const initialFormValues: IDisclosureFormValues = {
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
        <Tabs.Tab value="dpprocess" label="NAV som databehandler" />
        <Tabs.Tab value="utleveringer" label="Utleveringer" />
        {thirdTabTitle && <Tabs.Tab value={thirdTabTitle} label={thirdTabTitle} />}
      </Tabs.List>
      <Tabs.Panel value="behandlinger">
        <div className="my-2">
          <ProcessList
            code={code}
            listName={listName}
            processId={processId}
            filter={filter}
            section={section}
            moveScroll={moveScroll}
            isEditable={isEditable}
          />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="dpprocess">
        <div className="my-2">
          <DpProcessTable dpProcesses={dpProcessData} />
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="utleveringer">
        <div className="my-2">
          <div className="flex">
            <Heading size="xlarge" level="2">
              Utleveringer ({disclosureData ? disclosureData.length : 0})
            </Heading>
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

          {disclosureData.length === 0 && (
            <BodyShort className="my-4">Ingen utleveringer</BodyShort>
          )}

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
      {thirdTabTitle && thirdTabContent && (
        <Tabs.Panel value={thirdTabTitle}>{thirdTabContent}</Tabs.Panel>
      )}
    </Tabs>
  )
}

export default ProcessDisclosureTabs
