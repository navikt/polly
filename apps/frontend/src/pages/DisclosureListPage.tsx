import { Button as BButton, Button, KIND } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import { Plus } from 'baseui/icon'
import { HeadingLarge, LabelMedium } from 'baseui/typography'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDisclosure, DisclosureSummary, getAll, getDisclosureSummaries, getProcess } from '../api'
import { searchAaregAvtale } from '../api/AaregAvtaleApi'
import { AaregAvtaleTable } from '../components/AaregAvtale/AaregAvtaleTable'
import { ObjectLink } from '../components/common/RouteLink'
import SearchProcess from '../components/common/SearchProcess'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { AaregAvtale, Disclosure, DisclosureFormValues, ObjectType, Process } from '../constants'
import { ampli } from '../service/Amplitude'
import { ListName } from '../service/Codelist'
import { user } from '../service/User'
import { theme } from '../util'
import { checkForAaregDispatcher } from '../util/helper-functions'
import { useQueryParam, useTable } from '../util/hooks'

enum FilterType {
  legalbases = 'legalbases',
  emptylegalbases = 'emptylegalbases',
}

export const DisclosureListPage = () => {
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [newDisclosure, setNewDisclosure] = React.useState<Disclosure>()
  const [error, setError] = React.useState<string>()
  const [disclosures, setDisclosures] = useState<DisclosureSummary[]>([])
  const [selectedProcess, setSelectedProcess] = useState<Process>()
  const [table, sortColumn] = useTable<DisclosureSummary, keyof DisclosureSummary>(disclosures, {
    sorting: {
      name: (a, b) => a.name.localeCompare(b.name),
      legalBases: (a, b) => a.legalBases - b.legalBases,
      recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
      processes: (a, b) => a.processes.length - b.processes.length,
    },
    initialSortColumn: 'name',
  })
  const [aaregAvtaler, setAaregAvtaler] = useState<AaregAvtale[]>([])
  const [showAaregAvtaleTable, setShowAaregAvtaleTable] = useState<boolean>(false)
  const filter = useQueryParam<FilterType>('filter')
  const processFilter = useQueryParam<string>('process')
  const navigate = useNavigate()

  ampli.logEvent('besøk', { side: 'Utleveringer', url: '/disclosure', app: 'Behandlingskatalogen' })

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
    confidentialityDescription: undefined,
  }

  useEffect(() => {
    ;(async () => {
      const all = selectedProcess
        ? (await getAll(getDisclosureSummaries)()).filter((d) => d.processes.find((p) => p.id === selectedProcess.id))
        : await getAll(getDisclosureSummaries)()
      if (filter === FilterType.emptylegalbases) setDisclosures(all.filter((d) => !d.legalBases))
      else if (filter === FilterType.legalbases) setDisclosures(all.filter((d) => !!d.legalBases))
      else setDisclosures(all)
    })()
  }, [filter, newDisclosure, selectedProcess])

  useEffect(() => {
    ;(async () => {
      if (processFilter && processFilter.length >= 3) {
        const process = await getProcess(processFilter)
        if (process) {
          setSelectedProcess(process)
        }
      } else {
        setSelectedProcess(undefined)
      }
    })()
  }, [processFilter])

  useEffect(() => {
    ;(async () => {
      if ((selectedProcess && checkForAaregDispatcher(selectedProcess)) || showAaregAvtaleTable) {
        const res = await searchAaregAvtale('avt')
        setAaregAvtaler(res.content)
      }
    })()
  }, [selectedProcess, showAaregAvtaleTable])

  const handleCreateDisclosure = async (disclosure: DisclosureFormValues) => {
    try {
      setNewDisclosure(await createDisclosure(disclosure))
      setShowCreateModal(false)
    } catch (err: any) {
      setShowCreateModal(true)
      setError(err.message)
    }
  }

  const handleFilterChange = (url: string) => {
    if (selectedProcess) {
      return url + '&process=' + processFilter
    } else {
      return url
    }
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingLarge>Utleveringer</HeadingLarge>
        <div>
          <LabelMedium marginBottom={theme.sizing.scale600}>Filter behandlingsgrunnlag</LabelMedium>
          <ButtonGroup selected={!filter ? 0 : filter === FilterType.legalbases ? 1 : 2} mode="radio" shape="pill">
            <BButton
              onClick={() =>
                navigate(handleFilterChange('/disclosure?'), {
                  replace: true,
                })
              }
            >
              Alle
            </BButton>
            <BButton
              onClick={() =>
                navigate(handleFilterChange('/disclosure?filter=legalbases'), {
                  replace: true,
                })
              }
            >
              Utfylt
            </BButton>
            <BButton
              onClick={() =>
                navigate(handleFilterChange('/disclosure?filter=emptylegalbases'), {
                  replace: true,
                })
              }
            >
              Ufullstendig
            </BButton>
          </ButtonGroup>
        </div>
      </div>
      <div className="flex w-full mb-3">
        <div className="flex flex-1">
          <div className="flex flex-1">
            <SearchProcess selectedProcess={selectedProcess} setSelectedProcess={setSelectedProcess} />
          </div>
          <div className="ml-8px flex">
            <Button size="compact" onClick={() => setShowAaregAvtaleTable(!showAaregAvtaleTable)}>
              {' '}
              {showAaregAvtaleTable ? 'Skjul Aa-reg avtaler' : 'Vis Aa-reg avtaler'}
            </Button>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
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
              Opprett ny utlevering
            </Button>
          )}
        </div>
      </div>
      {!showAaregAvtaleTable && (
        <Table
          emptyText="Utleveringer"
          headers={
            <>
              <HeadCell title="Navn på utlevering" column="name" tableState={[table, sortColumn]} />
              <HeadCell title="Mottaker (ekstern part)" column="recipient" tableState={[table, sortColumn]} />
              <HeadCell title="Relaterte behandlinger" column="processes" tableState={[table, sortColumn]} />
              <HeadCell title="Behandlingsgrunnlag" column="legalBases" tableState={[table, sortColumn]} />
            </>
          }
        >
          {table.data.map((d) => (
            <Row key={d.id}>
              <Cell>
                <ObjectLink id={d.id} type={ObjectType.DISCLOSURE}>
                  {d.name}
                </ObjectLink>
              </Cell>
              <Cell>
                <ObjectLink id={d.recipient.code} type={ListName.THIRD_PARTY}>
                  {d.recipient.shortName}
                </ObjectLink>
              </Cell>
              <Cell>
                <div className="flex flex-col">
                  {d.processes.map((p) => (
                    <div key={p.id} className="mr-2.5">
                      <ObjectLink id={p.id} type={ObjectType.PROCESS}>
                        {p.purposes.map((pu) => pu.shortName).join(', ')}: {p.name}
                      </ObjectLink>
                    </div>
                  ))}
                </div>
              </Cell>
              <Cell>{d.legalBases ? 'Ja' : 'Nei'}</Cell>
            </Row>
          ))}
        </Table>
      )}
      {((selectedProcess && checkForAaregDispatcher(selectedProcess)) || showAaregAvtaleTable) && (
        <div className="mt-3">
          <AaregAvtaleTable aaregAvtaler={aaregAvtaler} />
        </div>
      )}
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
        disableRecipientField={false}
      />
    </>
  )
}
