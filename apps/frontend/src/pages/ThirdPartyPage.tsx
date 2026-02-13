import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Accordion, BodyLong, Button, Heading } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getAllDpProcesses } from '../api/DpProcessApi'
import {
  createDisclosure,
  deleteDisclosure,
  getDisclosuresByRecipient,
  getInformationTypesBy,
  updateDisclosure,
} from '../api/GetAllApi'
import ProcessList from '../components/Process/ProcessList'
import AccordionDisclosure from '../components/ThirdParty/AccordionDisclosure'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { Spinner } from '../components/common/Spinner'
import ThirdPartiesDpProcessTable from '../components/common/ThirdPartiesDpProcessTable'
import ThirdPartiesTable from '../components/common/ThirdPartiesTable'
import { IDisclosure, IDisclosureFormValues, IDpProcess, IInformationType } from '../constants'
import { CodelistService, EListName } from '../service/Codelist'
import { user } from '../service/User'
import { ESection } from './ProcessPage'

export type TPathParams = {
  thirdPartyCode: string
  section: 'disclosure' | 'dpprocess' | 'informationtype' | 'process' | undefined
  id?: string
}

const ThirdPartyPage = () => {
  const params = useParams<TPathParams>()
  const [codelistUtils] = CodelistService()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [disclosureList, setDisclosureList] = useState<IDisclosure[]>([])
  const [informationTypeList, setInformationTypeList] = useState<IInformationType[]>()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [dpProcesses, setDpProcesses] = useState<IDpProcess[]>([])
  const [error, setError] = useState<string>()
  const [processListCount, setProcessListCount] = useState<number>(0)
  const [expandedAccordion, setExpandedAccordion] = useState<string>(params.section || '')

  useEffect(() => {
    ;(async () => {
      const dps: IDpProcess[] = await getAllDpProcesses()
      if (dps) {
        setDpProcesses(
          dps.filter((dp) => dp.externalProcessResponsible?.code === params.thirdPartyCode)
        )
      }
    })()
  }, [])

  const handleCreateDisclosure = async (disclosure: IDisclosureFormValues) => {
    try {
      const createdDisclosure = await createDisclosure(disclosure)

      if (!disclosureList || disclosureList.length < 1) setDisclosureList([createdDisclosure])
      else if (disclosureList && createdDisclosure)
        setDisclosureList([...disclosureList, createdDisclosure])

      setShowCreateModal(false)
    } catch (error: any) {
      setShowCreateModal(true)
      setError(error.message)
    }
  }

  const handleEditDisclosure = async (disclosure: IDisclosureFormValues) => {
    try {
      const updatedDisclosure = await updateDisclosure(disclosure)
      setDisclosureList([
        ...disclosureList.filter(
          (disclosureItem: IDisclosure) => disclosureItem.id !== updatedDisclosure.id
        ),
        updatedDisclosure,
      ])
      return true
    } catch (error: any) {
      setError(error.message)
      return false
    }
  }

  const handleDeleteDisclosure = async (disclosure: IDisclosure) => {
    if (!disclosure) return false
    try {
      await deleteDisclosure(disclosure.id)
      setDisclosureList([
        ...disclosureList.filter(
          (disclosureItem: IDisclosure) => disclosureItem.id !== disclosure.id
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
      if (params.thirdPartyCode) {
        setDisclosureList(await getDisclosuresByRecipient(params.thirdPartyCode))
        setInformationTypeList(
          (await getInformationTypesBy({ source: params.thirdPartyCode })).content
        )
      }
      setIsLoading(false)
    })()
  }, [params.thirdPartyCode])

  const handleOnOpenChange = (isOpen: boolean, accordionKey: string): void => {
    if (isOpen) {
      setExpandedAccordion(accordionKey)
    } else {
      setExpandedAccordion('')
    }
  }

  return (
    <>
      {isLoading && <Spinner />}

      {!isLoading && codelistUtils && (
        <>
          {params.thirdPartyCode && (
            <div className="mb-12">
              <Heading level="1" size="medium" spacing>
                {codelistUtils.getShortname(EListName.THIRD_PARTY, params.thirdPartyCode)}
              </Heading>
              <BodyLong>
                {codelistUtils.getDescription(EListName.THIRD_PARTY, params.thirdPartyCode)}
              </BodyLong>
            </div>
          )}

          <Accordion>
            <Accordion.Item
              className="bg-white"
              open={expandedAccordion === 'disclosure'}
              onOpenChange={(open: boolean) => handleOnOpenChange(open, 'disclosure')}
            >
              <Accordion.Header>{`Utleveringer til ekstern part (${disclosureList?.length || 0})`}</Accordion.Header>
              <Accordion.Content>
                <div className="flex justify-end">
                  {user.canWrite() && (
                    <Button
                      size="small"
                      variant="tertiary"
                      icon={<PlusCircleIcon aria-hidden />}
                      onClick={() => setShowCreateModal(true)}
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
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              className="bg-white"
              open={expandedAccordion === 'informationtype'}
              onOpenChange={(open: boolean) => handleOnOpenChange(open, 'informationtype')}
            >
              <Accordion.Header>{`Innhentinger fra ekstern part (${informationTypeList?.length || 0})`}</Accordion.Header>
              <Accordion.Content>
                <ThirdPartiesTable informationTypes={informationTypeList || []} sortName={true} />
              </Accordion.Content>
            </Accordion.Item>

            {params.thirdPartyCode && (
              <Accordion.Item
                className="bg-white"
                open={expandedAccordion === 'dpprocess'}
                onOpenChange={(open: boolean) => handleOnOpenChange(open, 'dpprocess')}
              >
                <Accordion.Header>{`Nav er databehandler for ${codelistUtils.getShortname(EListName.THIRD_PARTY, params.thirdPartyCode)} i følgende behandlinger (${dpProcesses?.length || 0})`}</Accordion.Header>
                <Accordion.Content>
                  <ThirdPartiesDpProcessTable dpProcesses={dpProcesses || []} />
                </Accordion.Content>
              </Accordion.Item>
            )}
            <Accordion.Item
              className="bg-white"
              open={expandedAccordion === 'process'}
              onOpenChange={(open: boolean) => handleOnOpenChange(open, 'process')}
            >
              <Accordion.Header>{`Felles behandlingsansvarlig med Nav (${processListCount})`}</Accordion.Header>
              <Accordion.Content>
                {params.thirdPartyCode && (
                  <ProcessList
                    section={ESection.thirdparty}
                    code={params.thirdPartyCode}
                    listName={EListName.THIRD_PARTY}
                    isEditable={false}
                    hideTitle
                    getCount={setProcessListCount}
                  />
                )}
              </Accordion.Content>
            </Accordion.Item>
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
