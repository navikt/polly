import * as React from 'react'
import { useEffect, useState } from 'react'
import { intl, theme } from '../util'
import { useParams } from 'react-router-dom'
import { codelist, ListName } from '../service/Codelist'
import { Plus } from 'baseui/icon'
import { Block } from 'baseui/block'
import { createDisclosure, deleteDisclosure, getDisclosuresByRecipient, getInformationTypesBy, updateDisclosure } from '../api'
import { HeadingMedium, ParagraphMedium } from 'baseui/typography'
import { Button, KIND } from 'baseui/button'
import { user } from '../service/User'
import { Disclosure, DisclosureFormValues, DpProcess, InformationType } from '../constants'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { Spinner } from 'baseui/spinner'
import ThirdPartiesTable from '../components/common/ThirdPartiesTable'
import ProcessList from '../components/Process'
import { Section } from './ProcessPage'
import { getAllDpProcesses } from '../api/DpProcessApi'
import ThirdPartiesDpProcessTable from '../components/common/ThirdPartiesDpProcessTable'
import AccordionDisclosure from '../components/ThirdParty/AccordionDisclosure'
import { Accordion, Panel } from 'baseui/accordion'
import { toggleOverride } from '../components/common/Accordion'
import {ampli} from "../service/Amplitude";

export type PathParams = {
  thirdPartyCode: string
  section: 'disclosure' | 'dpprocess' | 'informationtype' | 'process' | undefined
  id?: string
}

const ThirdPartyPage = () => {
  const params = useParams<PathParams>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [disclosureList, setDisclosureList] = React.useState<Disclosure[]>([])
  const [informationTypeList, setInformationTypeList] = React.useState<InformationType[]>()
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [dpProcesses, setDpProcesses] = useState<DpProcess[]>([])
  const [error, setError] = React.useState<string>()
  const [processListCount, setProcessListCount] = React.useState<number>(0)

  ampli.logEvent("besøk", {side: 'Eksterne parter'})

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
            <Block marginBottom="3rem">
              <HeadingMedium>{codelist.getShortname(ListName.THIRD_PARTY, params.thirdPartyCode)}</HeadingMedium>
              <ParagraphMedium>{codelist.getDescription(ListName.THIRD_PARTY, params.thirdPartyCode)}</ParagraphMedium>
            </Block>
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
            <Panel title={intl.disclosuresToThirdParty + ` (${disclosureList?.length || 0})`} key="disclosure">
              <Block display="flex" justifyContent="flex-end">
                {user.canWrite() && (
                  <Button
                    size="compact"
                    kind={KIND.tertiary}
                    onClick={() => setShowCreateModal(true)}
                    startEnhancer={() => (
                      <Block display="flex" justifyContent="center">
                        <Plus size={22} />
                      </Block>
                    )}
                  >
                    {intl.createNew}
                  </Button>
                )}
              </Block>
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

            <Panel title={intl.retrievedFromThirdParty + ` (${informationTypeList?.length || 0})`} key="informationtype">
              <ThirdPartiesTable informationTypes={informationTypeList || []} sortName={true} />
            </Panel>

            {params.thirdPartyCode && (
              <Panel
                key="dpprocess"
                title={intl.formatString(intl.thirdPartyDpProcessTableTitle, codelist.getShortname(ListName.THIRD_PARTY, params.thirdPartyCode)) + ` (${dpProcesses?.length || 0})`}
              >
                <ThirdPartiesDpProcessTable dpProcesses={dpProcesses || []} />
              </Panel>
            )}

            <Panel key="process" title={`${intl.commonExternalProcessResponsible} ${intl.with} ${intl.pollyOrg} (${processListCount})`}>
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
            title={intl.createThirdPartyModalTitle}
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
