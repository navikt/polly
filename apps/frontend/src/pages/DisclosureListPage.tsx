import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Button, Heading, Label, Loader, Search, ToggleGroup } from '@navikt/ds-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { searchAaregAvtale } from '../api/AaregAvtaleApi'
import {
  IDisclosureSummary,
  createDisclosure,
  getAll,
  getDisclosureSummaries,
} from '../api/GetAllApi'
import { AaregAvtaleTable } from '../components/AaregAvtale/AaregAvtaleTable'
import ModalThirdParty from '../components/ThirdParty/ModalThirdPartyForm'
import { ObjectLink } from '../components/common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../components/common/Table'
import { EObjectType, IAaregAvtale, IDisclosure, IDisclosureFormValues } from '../constants'
import { EListName } from '../service/Codelist'
import { user } from '../service/User'
import { theme, useDebouncedState } from '../util'
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
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useDebouncedState('', 200)

  const filteredDisclosures = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return disclosures

    return disclosures.filter((d) => {
      const nameMatch = d.name?.toLowerCase().includes(q)
      const recipientMatch = d.recipient?.shortName?.toLowerCase().includes(q)
      return !!nameMatch || !!recipientMatch
    })
  }, [disclosures, search])

  const [table, sortColumn] = useTable<IDisclosureSummary, keyof IDisclosureSummary>(
    filteredDisclosures,
    {
      sorting: {
        name: (a, b) => a.name.localeCompare(b.name),
        legalBases: (a, b) => a.legalBases - b.legalBases,
        recipient: (a, b) => a.recipient.shortName.localeCompare(b.recipient.shortName),
        processes: (a, b) => a.processes.length - b.processes.length,
      },
      initialSortColumn: 'name',
    }
  )
  const [aaregAvtaler, setAaregAvtaler] = useState<IAaregAvtale[]>([])
  const [showAaregAvtaleTable, setShowAaregAvtaleTable] = useState<boolean>(false)
  const [isAaregAvtaleLoading, setAaregAvtaleLoading] = useState<boolean>(false)
  const filter = useQueryParam<EFilterType>('filter')
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
      const all = await getAll(getDisclosureSummaries)()
      if (filter === EFilterType.emptylegalbases) setDisclosures(all.filter((d) => !d.legalBases))
      else if (filter === EFilterType.legalbases) setDisclosures(all.filter((d) => !!d.legalBases))
      else setDisclosures(all)
    })()
  }, [filter, newDisclosure])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (!showAaregAvtaleTable) {
        setAaregAvtaleLoading(false)
        return
      }

      try {
        setAaregAvtaleLoading(true)
        const res = await searchAaregAvtale('avt')
        if (!cancelled) setAaregAvtaler(res.content)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Kunne ikke hente Aa-reg avtaler')
      } finally {
        if (!cancelled) setAaregAvtaleLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [showAaregAvtaleTable])

  const handleCreateDisclosure = async (disclosure: IDisclosureFormValues) => {
    try {
      setNewDisclosure(await createDisclosure(disclosure))
      setShowCreateModal(false)
    } catch (error: any) {
      setShowCreateModal(true)
      setError(error.message)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading level="1" size="large">
          Utleveringer
        </Heading>
        <div>
          <Label style={{ marginBottom: theme.sizing.scale200, display: 'block' }}>
            Filter behandlingsgrunnlag
          </Label>
          <ToggleGroup
            size="small"
            value={!filter ? 'all' : filter}
            onChange={(value) => {
              if (!value) return
              if (value === 'all') {
                navigate('/disclosure?', { replace: true })
              } else if (value === EFilterType.legalbases) {
                navigate('/disclosure?filter=legalbases', { replace: true })
              } else {
                navigate('/disclosure?filter=emptylegalbases', { replace: true })
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
        <div className="flex flex-1 items-center gap-2 flex-nowrap min-w-0">
          <Search
            className="flex-1 min-w-0"
            label="Søk etter utleveringer"
            hideLabel
            size="small"
            variant="simple"
            placeholder="Søk på navn eller mottaker"
            value={searchInput}
            onChange={(value) => {
              setSearchInput(value)
              setSearch(value)
            }}
          />
          <Button
            className="shrink-0"
            size="small"
            variant="secondary"
            loading={isAaregAvtaleLoading}
            onClick={() => {
              if (isAaregAvtaleLoading) return
              setShowAaregAvtaleTable(!showAaregAvtaleTable)
            }}
          >
            {showAaregAvtaleTable ? 'Skjul Aa-reg avtaler' : 'Vis Aa-reg avtaler'}
          </Button>
        </div>
        <div className="flex flex-1 justify-end mt-2">
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
      {showAaregAvtaleTable && (
        <div className="mt-3">
          {isAaregAvtaleLoading ? (
            <Loader size="large" className="flex justify-self-center" />
          ) : (
            <AaregAvtaleTable aaregAvtaler={aaregAvtaler} />
          )}
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
