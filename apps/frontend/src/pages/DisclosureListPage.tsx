import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Button, Heading, Label, ToggleGroup } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { searchAaregAvtale } from '../api/AaregAvtaleApi'
import {
  IDisclosureSummary,
  createDisclosure,
  getAll,
  getDisclosureSummaries,
  getProcess,
} from '../api/GetAllApi'
import { AaregAvtaleTable } from '../components/AaregAvtale/AaregAvtaleTable'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { ObjectLink } from '../components/common/RouteLink'
import SearchProcess from '../components/common/SearchProcess'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import {
  EObjectType,
  IAaregAvtale,
  IDisclosure,
  IDisclosureFormValues,
  IProcess,
} from '../constants'
import { EListName } from '../service/Codelist'
import { user } from '../service/User'
import { theme } from '../util'
import { checkForAaregDispatcher } from '../util/helper-functions'
import { useQueryParam, useTable } from '../util/hooks'

enum EFilterType {
  legalbases = 'legalbases',
  emptylegalbases = 'emptylegalbases',
}

export const DisclosureListPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newDisclosure, setNewDisclosure] = useState<IDisclosure>()
  const [error, setError] = useState<string>()
  const [disclosures, setDisclosures] = useState<IDisclosureSummary[]>([])
  const [selectedProcess, setSelectedProcess] = useState<IProcess>()
  const [table, sortColumn] = useTable<IDisclosureSummary, keyof IDisclosureSummary>(disclosures, {
    sorting: {
      name: (a, b) => a.name.localeCompare(b.name),
      legalBases: (a, b) => a.legalBases - b.legalBases,
      recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
      processes: (a, b) => a.processes.length - b.processes.length,
    },
    initialSortColumn: 'name',
  })
  const [aaregAvtaler, setAaregAvtaler] = useState<IAaregAvtale[]>([])
  const [showAaregAvtaleTable, setShowAaregAvtaleTable] = useState<boolean>(false)
  const filter = useQueryParam<EFilterType>('filter')
  const processFilter = useQueryParam<string>('process')
  const navigate = useNavigate()

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
    confidentialityDescription: undefined,
  }

  useEffect(() => {
    ;(async () => {
      const all = selectedProcess
        ? (await getAll(getDisclosureSummaries)()).filter((d) =>
            d.processes.find((p) => p.id === selectedProcess.id)
          )
        : await getAll(getDisclosureSummaries)()
      if (filter === EFilterType.emptylegalbases) setDisclosures(all.filter((d) => !d.legalBases))
      else if (filter === EFilterType.legalbases) setDisclosures(all.filter((d) => !!d.legalBases))
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

  const handleCreateDisclosure = async (disclosure: IDisclosureFormValues) => {
    try {
      setNewDisclosure(await createDisclosure(disclosure))
      setShowCreateModal(false)
    } catch (error: any) {
      setShowCreateModal(true)
      setError(error.message)
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
        <Heading level="1" size="large">
          Utleveringer
        </Heading>
        <div>
          <Label style={{ marginBottom: theme.sizing.scale600, display: 'block' }}>
            Filter behandlingsgrunnlag
          </Label>
          <ToggleGroup
            size="small"
            value={!filter ? 'all' : filter}
            onChange={(value) => {
              if (!value) return
              if (value === 'all') {
                navigate(handleFilterChange('/disclosure?'), { replace: true })
              } else if (value === EFilterType.legalbases) {
                navigate(handleFilterChange('/disclosure?filter=legalbases'), { replace: true })
              } else {
                navigate(handleFilterChange('/disclosure?filter=emptylegalbases'), {
                  replace: true,
                })
              }
            }}
          >
            <ToggleGroup.Item value="all">Alle</ToggleGroup.Item>
            <ToggleGroup.Item value={EFilterType.legalbases}>Utfylt</ToggleGroup.Item>
            <ToggleGroup.Item value={EFilterType.emptylegalbases}>Ufullstendig</ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
      <div className="flex w-full mb-3">
        <div className="flex flex-1">
          <div className="flex flex-1">
            <SearchProcess
              selectedProcess={selectedProcess}
              setSelectedProcess={setSelectedProcess}
            />
          </div>
          <div className="ml-8px flex">
            <Button
              size="small"
              variant="secondary"
              onClick={() => setShowAaregAvtaleTable(!showAaregAvtaleTable)}
            >
              {' '}
              {showAaregAvtaleTable ? 'Skjul Aa-reg avtaler' : 'Vis Aa-reg avtaler'}
            </Button>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          {user.canWrite() && (
            <Button
              size="small"
              variant="tertiary"
              icon={<PlusCircleIcon aria-hidden />}
              onClick={() => setShowCreateModal(true)}
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
              <HeadCell
                title="Mottaker (ekstern part)"
                column="recipient"
                tableState={[table, sortColumn]}
              />
              <HeadCell
                title="Relaterte behandlinger"
                column="processes"
                tableState={[table, sortColumn]}
              />
              <HeadCell
                title="Behandlingsgrunnlag"
                column="legalBases"
                tableState={[table, sortColumn]}
              />
            </>
          }
        >
          {table.data.map((data) => (
            <Row key={data.id}>
              <Cell>
                <ObjectLink id={data.id} type={EObjectType.DISCLOSURE}>
                  {data.name}
                </ObjectLink>
              </Cell>
              <Cell>
                <ObjectLink id={data.recipient.code} type={EListName.THIRD_PARTY}>
                  {data.recipient.shortName}
                </ObjectLink>
              </Cell>
              <Cell>
                <div className="flex flex-col">
                  {data.processes.map((process) => (
                    <div key={process.id} className="mr-2.5">
                      <ObjectLink id={process.id} type={EObjectType.PROCESS}>
                        {process.purposes.map((purpose) => purpose.shortName).join(', ')}:{' '}
                        {process.name}
                      </ObjectLink>
                    </div>
                  ))}
                </div>
              </Cell>
              <Cell>{data.legalBases ? 'Ja' : 'Nei'}</Cell>
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
