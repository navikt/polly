import { BodyShort, Button, Heading, Label, Tooltip } from '@navikt/ds-react'
import { useState } from 'react'
import { EProcessStatusFilter, IDashboardData, ISeksjonDashCount } from '../../constants'
import Charts from '../Charts/Charts'

interface ITextWithNumberProps {
  label: string
  number: number
}

const TextWithNumber = (props: ITextWithNumberProps) => {
  const { label, number } = props

  return (
    <div className="flex w-fit mb-0 justify-center">
      <BodyShort className="m-0">
        {label}{' '}
        <b
          style={{
            textDecoration: 'underline',
          }}
        >
          {number}
        </b>
      </BodyShort>
    </div>
  )
}

type TSeksjonCardProps = {
  seksjon: ISeksjonDashCount
  isActive?: boolean
  onClick: (seksjon: ISeksjonDashCount) => void
}

const SeksjonCard = (props: TSeksjonCardProps) => {
  const { seksjon, isActive, onClick } = props

  return (
    <Tooltip content={seksjon.seksjonName}>
      <Button type="button" variant="tertiary-neutral" onClick={() => onClick(seksjon)}>
        <div
          className={`bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] ${
            isActive ? 'ring-2 ring-(--ax-text-accent)' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-around w-52 h-28">
            <Label style={{ color: 'var(--ax-text-accent)', textAlign: 'center' }}>
              {seksjon.seksjonName || seksjon.seksjonId}
            </Label>
            <TextWithNumber label="Godkjent" number={seksjon.processesCompleted} />
            <TextWithNumber label="Under arbeid" number={seksjon.processesInProgress} />
            <TextWithNumber label="Revidering" number={seksjon.processesNeedsRevision} />
          </div>
        </div>
      </Button>
    </Tooltip>
  )
}

type TSeksjonerProps = {
  data: IDashboardData
  activeSeksjonId?: string
}

const Seksjoner = (props: TSeksjonerProps) => {
  const { data, activeSeksjonId } = props

  const sortedData = () => {
    return (data.seksjoner ?? [])
      .filter((seksjon) => seksjon.seksjonId !== '')
      .sort((a, b) => {
        if (!a.seksjonName) return 1
        if (!b.seksjonName) return -1
        return a.seksjonName.localeCompare(b.seksjonName)
      })
  }

  const [selectedSeksjon, setSelectedSeksjon] = useState<ISeksjonDashCount | undefined>(
    () => sortedData()[0]
  )

  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap gap-4">
        {sortedData().map((seksjon: ISeksjonDashCount, index: number) => (
          <SeksjonCard
            key={index}
            seksjon={seksjon}
            isActive={seksjon.seksjonId === (selectedSeksjon?.seksjonId ?? activeSeksjonId)}
            onClick={(s) =>
              setSelectedSeksjon((prev) => (prev?.seksjonId === s.seksjonId ? undefined : s))
            }
          />
        ))}
      </div>
      {selectedSeksjon && (
        <div className="mt-6">
          <Heading size="small" level="3" className="mb-2">
            {selectedSeksjon.seksjonName || selectedSeksjon.seksjonId}
          </Heading>
          <Charts chartData={selectedSeksjon} processStatus={EProcessStatusFilter.All} />
        </div>
      )}
    </div>
  )
}

export default Seksjoner
