import { Button, Heading, Loader, Select, Table } from '@navikt/ds-react'
import axios from 'axios'
import { useState } from 'react'
import { env } from '../../../util/env'

interface IFieldDef {
  value: string
  label: string
}

interface IGroup {
  label: string
  fields: IFieldDef[]
}

const GROUPS: IGroup[] = [
  {
    label: 'Behandlingsgrunnlag for hele behandlingen',
    fields: [{ value: 'LEGAL_BASES', label: 'Behandlingsgrunnlag for hele behandlingen' }],
  },
  {
    label: 'Automatisering og profilering',
    fields: [
      { value: 'AUTOMATIC_PROCESSING', label: 'Helautomatisk behandling' },
      { value: 'PROFILING', label: 'Profilering' },
    ],
  },
  {
    label: 'Databehandler',
    fields: [{ value: 'DATA_PROCESSING', label: 'Databehandler' }],
  },
  {
    label: 'Lagringsbehov',
    fields: [{ value: 'RETENTION', label: 'Lagringsbehov' }],
  },
  {
    label: 'Personkonsekvensvurdering (PVK)',
    fields: [{ value: 'DPIA', label: 'Personkonsekvensvurdering (PVK)' }],
  },
  {
    label: 'Kunstig intelligens',
    fields: [{ value: 'AI_USAGE_DESCRIPTION', label: 'Kunstig intelligens' }],
  },
  {
    label: 'Organisering',
    fields: [{ value: 'AFFILIATION', label: 'Organisering' }],
  },
]

const ALL_LABEL = 'Alle felt'

interface IFieldChangeSummary {
  field: string
  fieldDisplayName: string
  from: string
  to: string
  totalProcesses: number
  changedCount: number
}

interface IResultRow {
  label: string
  summary: IFieldChangeSummary
}

const getFieldChangeSummary = async (
  field: string,
  from: string,
  to: string
): Promise<IFieldChangeSummary> => {
  return (
    await axios.get<IFieldChangeSummary>(`${env.pollyBaseUrl}/process/fieldchanges`, {
      params: { field, from, to },
    })
  ).data
}

export const ProcessChangesPage = () => {
  const [groupLabel, setGroupLabel] = useState(ALL_LABEL)
  const [from, setFrom] = useState('2025-01-01')
  const [to, setTo] = useState('2026-01-01')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [results, setResults] = useState<IResultRow[]>([])

  const selectedGroup = GROUPS.find((g) => g.label === groupLabel)

  const handleGroupChange = (label: string) => {
    setGroupLabel(label)
    setResults([])
    setError(undefined)
  }

  const search = async () => {
    setLoading(true)
    setError(undefined)
    setResults([])
    const fieldsToFetch = selectedGroup ? selectedGroup.fields : GROUPS.flatMap((g) => g.fields)
    try {
      const rows = await Promise.all(
        fieldsToFetch.map(async (f) => ({
          label: f.label,
          summary: await getFieldChangeSummary(f.value, from, to),
        }))
      )
      setResults(rows)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Noe gikk galt')
    }
    setLoading(false)
  }

  return (
    <div role="main" className="w-full px-4">
      <Heading size="large" level="1" className="mt-4 mb-6">
        Endringer i behandlinger
      </Heading>

      <div className="flex flex-col gap-4 max-w-xl">
        <Select label="Felt" value={groupLabel} onChange={(e) => handleGroupChange(e.target.value)}>
          <option value={ALL_LABEL}>{ALL_LABEL}</option>
          {GROUPS.map((g) => (
            <option key={g.label} value={g.label}>
              {g.label}
            </option>
          ))}
        </Select>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="from-date">
              Fra dato
            </label>
            <input
              id="from-date"
              type="date"
              className="border border-gray-400 rounded px-2 py-1"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="to-date">
              Til dato
            </label>
            <input
              id="to-date"
              type="date"
              className="border border-gray-400 rounded px-2 py-1"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Button onClick={search} loading={loading} disabled={!from || !to}>
            Hent statistikk
          </Button>
        </div>
      </div>

      {loading && (
        <div className="mt-8 flex justify-center">
          <Loader size="3xlarge" />
        </div>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {results.length > 0 && (
        <div className="mt-8 w-max">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="whitespace-nowrap">Felt</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap">Periode</Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap text-center">
                  Totalt antall behandlinger
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap text-center">
                  Antall med endring
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((row, i) => (
                <Table.Row key={i}>
                  <Table.DataCell className="whitespace-nowrap">{row.label}</Table.DataCell>
                  <Table.DataCell className="whitespace-nowrap">
                    {row.summary.from} – {row.summary.to}
                  </Table.DataCell>
                  <Table.DataCell className="whitespace-nowrap text-center">
                    {row.summary.totalProcesses}
                  </Table.DataCell>
                  <Table.DataCell className="whitespace-nowrap text-center">
                    {row.summary.changedCount}
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  )
}
