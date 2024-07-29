import { Accordion, Panel } from 'baseui/accordion'
import { Button, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { Spinner } from 'baseui/spinner'
import { HeadingMedium, ParagraphMedium } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createDisclosure, deleteDisclosure, getDisclosuresByRecipient, getInformationTypesBy, updateDisclosure } from '../api'
import { getAllDpProcesses } from '../api/DpProcessApi'
import ProcessList from '../components/Process/ProcessList'
import AccordionDisclosure from '../components/ThirdParty/AccordionDisclosure'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { toggleOverride } from '../components/common/Accordion'
import ThirdPartiesDpProcessTable from '../components/common/ThirdPartiesDpProcessTable'
import ThirdPartiesTable from '../components/common/ThirdPartiesTable'
import { Disclosure, DisclosureFormValues, DpProcess, InformationType } from '../constants'
import { ampli } from '../service/Amplitude'
import { ListName, codelist } from '../service/Codelist'
import { user } from '../service/User'
import { theme } from '../util'
import { Section } from './ProcessPage'

export type PathParams = {
  thirdPartyCode: string
  section: 'disclosure' | 'dpprocess' | 'informationtype' | 'process' | undefined
  id?: string
}

const ThirdPartyPage = () => {
  const params = useParams<PathParams>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [disclosureList, setDisclosureList] = useState<Disclosure[]>([])
  const [informationTypeList, setInformationTypeList] = useState<InformationType[]>()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [dpProcesses, setDpProcesses] = useState<DpProcess[]>([])
  const [error, setError] = useState<string>()
  const [processListCount, setProcessListCount] = useState<number>(0)

  ampli.logEvent('besøk', { side: 'Eksterne parter', url: '/thirdparty/:thirdPartyCode/', app: 'Behandlingskatalogen' })

  useEffect(() => {
    ;(async () => {
      let dps: DpProcess[] = await getAllDpProcesses()
      if (dps) {
        setDpProcesses(dps.filter((dp) => dp.externalProcessResponsible?.code === params.thirdPartyCode))
      }
    })()
  }, [])

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let createdDisclosure = await createDisclosure(disclosure)

      if (!disclosureList || disclosureList.length < 1) setDisclosureList([createdDisclosure])
      else if (disclosureList && createdDisclosure) setDisclosureList([...disclosureList, createdDisclosure])

      setShowCreateModal(false)
    } catch (err: any) {
      setShowCreateModal(true)
      setError(err.message)
    }
  }

  const handleEditDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      let updatedDisclosure = await updateDisclosure(disclosure)
      setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== updatedDisclosure.id), updatedDisclosure])
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
      setDisclosureList([...disclosureList.filter((d: Disclosure) => d.id !== disclosure.id)])
      setError(undefined)
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const initialFormValues: DisclosureFormValues = {
    name: '',
    recipient: params.thirdPartyCode,
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

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      await codelist.wait()
      if (params.thirdPartyCode) {
        setDisclosureList(await getDisclosuresByRecipient(params.thirdPartyCode))
        setInformationTypeList((await getInformationTypesBy({ source: params.thirdPartyCode })).content)
      }
      setIsLoading(false)
    })()
  }, [params.thirdPartyCode])

  return (
    <>
      {isLoading && <Spinner />}

      {!isLoading && codelist && (
        <>
          {params.thirdPartyCode && (
            <div className="mb-12">
              <HeadingMedium>{codelist.getShortname(ListName.THIRD_PARTY, params.thirdPartyCode)}</HeadingMedium>
              <ParagraphMedium>{codelist.getDescription(ListName.THIRD_PARTY, params.thirdPartyCode)}</ParagraphMedium>
            </div>
          )}

          <Accordion
            renderAll
            overrides={{
              Content: {
                style: (p) => ({
                  backgroundColor: theme.colors.white,
                }),
              },
              ToggleIcon: toggleOverride,
            }}
            initialState={{ expanded: params.section ? [params.section] : [] }}
          >
            <Panel title={`Utleveringer til ekstern part (${disclosureList?.length || 0})`} key="disclosure">
              <div className="flex justify-end">
                {user.canWrite() && (
                  <Button
                    size="compact"
                    kind={KIND.tertiary}
                    onClick={() => setShowCreateModal(true)}
                    startEnhancer={() => (
                      <div className="flex justify-center">
                        <Plus size={22} />
                      </div>
                    )}
                  >
                    Opprett ny
                  </Button>
                )}
              </div>
              <AccordionDisclosure
                disclosureList={disclosureList}
                showRecipient={false}
                errorModal={error}
                editable
                submitDeleteDisclosure={handleDeleteDisclosure}
                submitEditDisclosure={handleEditDisclosure}
                onCloseModal={() => setError(undefined)}
                expand={params.id}
              />
            </Panel>

            <Panel title={`Innhentinger fra ekstern part (${informationTypeList?.length || 0})`} key="informationtype">
              <ThirdPartiesTable informationTypes={informationTypeList || []} sortName={true} />
            </Panel>

            {params.thirdPartyCode && (
              <Panel
                key="dpprocess"
                title={`NAV er databehandler for ${codelist.getShortname(ListName.THIRD_PARTY, params.thirdPartyCode)} i følgende behandlinger (${dpProcesses?.length || 0})`}
              >
                <ThirdPartiesDpProcessTable dpProcesses={dpProcesses || []} />
              </Panel>
            )}

            <Panel key="process" title={`Felles behandlingsansvarlig med NAV (${processListCount})`}>
              {params.thirdPartyCode && (
                <ProcessList
                  section={Section.thirdparty}
                  code={params.thirdPartyCode}
                  listName={ListName.THIRD_PARTY}
                  isEditable={false}
                  hideTitle
                  getCount={setProcessListCount}
                />
              )}
            </Panel>
          </Accordion>

          <ModalThirdParty
            title="Opprett utlevering til ekstern part"
            isOpen={showCreateModal}
            initialValues={initialFormValues}
            submit={handleCreateDisclosure}
            onClose={() => {
              setShowCreateModal(false)
              setError(undefined)
            }}
            errorOnCreate={error}
            disableRecipientField={true}
          />
        </>
      )}
    </>
  )
}

export default ThirdPartyPage
