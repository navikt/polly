import { BodyShort, Button, Label, Tooltip } from '@navikt/ds-react'
import { IDashboardData, ISeksjonDashCount } from '../../constants'

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
}

const SeksjonCard = (props: TSeksjonCardProps) => {
  const { seksjon } = props

  return (
    <Tooltip content={seksjon.seksjonName}>
      <Button type="button" variant="tertiary-neutral">
        <div className="bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)]">
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
}

const Seksjoner = (props: TSeksjonerProps) => {
  const { data } = props

  const sortedData = () => {
    return (data.seksjoner ?? [])
      .filter((seksjon) => seksjon.seksjonId !== '')
      .sort((a, b) => {
        if (!a.seksjonName) return 1
        if (!b.seksjonName) return -1
        return a.seksjonName.localeCompare(b.seksjonName)
      })
  }

  return (
    <div className="w-full flex flex-wrap gap-4">
      {sortedData().map((seksjon: ISeksjonDashCount, index: number) => (
        <SeksjonCard key={index} seksjon={seksjon} />
      ))}
    </div>
  )
}

export default Seksjoner
