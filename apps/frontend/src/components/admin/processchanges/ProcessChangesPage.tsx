import { Button, Heading, Loader, Select, Table } from '@navikt/ds-react'
import axios from 'axios'
import { useState } from 'react'
import { env } from '../../../util/env'

const FIELDS = [
  { value: 'LEGAL_BASES', label: 'Behandlingsgrunnlag for hele behandlingen' },
  { value: 'PURPOSES', label: 'Formål' },
  { value: 'AUTOMATIC_PROCESSING', label: 'Automatisk behandling' },
  { value: 'PROFILING', label: 'Profilering' },
  { value: 'DATA_PROCESSING', label: 'Databehandling' },
  { value: 'RETENTION', label: 'Oppbevaringstid' },
  { value: 'DPIA', label: 'PVK' },
  { value: 'AFFILIATION', label: 'Tilhørighet' },
]

interface IFieldChangeSummary {
  field: string
  fieldDisplayName: string
  from: string
  to: string
  totalProcesses: number
  changedCount: number
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
  const [field, setField] = useState(FIELDS[0].value)
  const [from, setFrom] = useState('2025-01-01')
  const [to, setTo] = useState('2026-01-01')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [result, setResult] = useState<IFieldChangeSummary | undefined>()

  const search = async () => {
    setLoading(true)
    setError(undefined)
    setResult(undefined)
    try {
      setResult(await getFieldChangeSummary(field, from, to))
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
        <Select label="Felt" value={field} onChange={(e) => setField(e.target.value)}>
          {FIELDS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
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

      {result && (
        <div className="mt-8 max-w-xl">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Felt</Table.HeaderCell>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Totalt antall behandlinger</Table.HeaderCell>
                <Table.HeaderCell>Antall med endring</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.DataCell>{result.fieldDisplayName}</Table.DataCell>
                <Table.DataCell>
                  {result.from} – {result.to}
                </Table.DataCell>
                <Table.DataCell>{result.totalProcesses}</Table.DataCell>
                <Table.DataCell>{result.changedCount}</Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  )
}
