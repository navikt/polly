import { Button, DatePicker, Heading, Loader, Select, Table, useDatepicker } from '@navikt/ds-react'
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
    label: 'Organisering',
    fields: [
      { value: 'AFFILIATION_DEPARTMENT', label: 'Avdeling' },
      { value: 'AFFILIATION_SUB_DEPARTMENTS', label: 'Linja' },
      { value: 'AFFILIATION_PRODUCT_TEAMS', label: 'Team (Oppslag i Teamkatalogen)' },
      { value: 'COMMON_EXTERNAL_PROCESS_RESPONSIBLE', label: 'Felles behandlingsansvarlig' },
    ],
  },
  {
    label: 'Behandlingsgrunnlag for hele behandlingen',
    fields: [{ value: 'LEGAL_BASES', label: 'Behandlingsgrunnlag for hele behandlingen' }],
  },
  {
    label: 'Automatisering og profilering',
    fields: [
      {
        value: 'AUTOMATIC_PROCESSING',
        label:
          'Treffes det et vedtak eller en avgjørelse som er basert på helautomatisert behandling?',
      },
      { value: 'PROFILING', label: 'Benyttes profilering' },
    ],
  },
  {
    label: 'Kunstig intelligens',
    fields: [
      {
        value: 'AI_IN_USE',
        label: 'Benyttes det KI-systemer for å gjennomføre behandlingen?',
      },
      {
        value: 'AI_REUSING_PERSONAL_INFORMATION',
        label: 'Gjenbrukes personopplysningene til å utvikle KI-systemer?',
      },
    ],
  },
  {
    label: 'Databehandler',
    fields: [{ value: 'DATA_PROCESSING', label: 'Benyttes databehandler(e)' }],
  },
  {
    label: 'Lagringsbehov',
    fields: [{ value: 'RETENTION', label: 'Lagringsbehov' }],
  },
  {
    label: 'Personkonsekvensvurdering (PVK)',
    fields: [{ value: 'DPIA', label: 'Er det behov for PVK?' }],
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

interface IGroupResult {
  groupLabel: string
  rows: IResultRow[]
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
  const [to, setTo] = useState('2025-12-31')
  const [loading, setLoading] = useState(false)

  const { datepickerProps: fromPickerProps, inputProps: fromInputProps } = useDatepicker({
    defaultSelected: new Date('2025-01-01'),
    onDateChange: (date) => date && setFrom(date.toISOString().split('T')[0]),
  })

  const { datepickerProps: toPickerProps, inputProps: toInputProps } = useDatepicker({
    defaultSelected: new Date('2025-12-31'),
    onDateChange: (date) => date && setTo(date.toISOString().split('T')[0]),
  })
  const [error, setError] = useState<string | undefined>()
  const [results, setResults] = useState<IGroupResult[]>([])

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
    const groupsToFetch = selectedGroup ? [selectedGroup] : GROUPS
    try {
      const groupResults = await Promise.all(
        groupsToFetch.map(async (g) => ({
          groupLabel: g.label,
          rows: await Promise.all(
            g.fields.map(async (f) => ({
              label: f.label,
              summary: await getFieldChangeSummary(f.value, from, to),
            }))
          ),
        }))
      )
      setResults(groupResults)
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
          <DatePicker {...fromPickerProps} dropdownCaption>
            <DatePicker.Input {...fromInputProps} label="Fra dato" />
          </DatePicker>

          <DatePicker {...toPickerProps} dropdownCaption>
            <DatePicker.Input {...toInputProps} label="Til dato" />
          </DatePicker>
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
                <Table.HeaderCell className="whitespace-nowrap text-center">
                  Periode
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap text-center">
                  Totalt antall behandlinger
                </Table.HeaderCell>
                <Table.HeaderCell className="whitespace-nowrap text-center">
                  Antall med endring
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((group) => (
                <>
                  {results.length > 1 && (
                    <Table.Row key={`header-${group.groupLabel}`}>
                      <Table.DataCell
                        colSpan={4}
                        className="font-bold uppercase tracking-wide text-xs bg-deepblue-50 text-deepblue-800 border-t-2 border-deepblue-300 pt-5 pb-2"
                      >
                        {group.groupLabel}
                      </Table.DataCell>
                    </Table.Row>
                  )}
                  {group.rows.map((row, i) => (
                    <Table.Row key={`${group.groupLabel}-${i}`}>
                      <Table.DataCell className="whitespace-nowrap">{row.label}</Table.DataCell>
                      <Table.DataCell className="whitespace-nowrap text-center">
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
                </>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  )
}
