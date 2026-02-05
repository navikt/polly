import { BodyShort, Box, HGrid } from '@navikt/ds-react'
import RouteLink from './RouteLink'

type TOpt = { id: string; label: string }

interface IAlphabeticListProps {
  items: TOpt[]
  baseUrl: string
}

const AlphabeticList = (props: IAlphabeticListProps) => {
  const { baseUrl } = props
  const items = props.items
    .sort((a: TOpt, b: TOpt) => a.label.localeCompare(b.label))
    .reduce(
      (acc, cur: TOpt) => {
        const letter: string = cur.label.toUpperCase()[0]
        acc[letter] = [...(acc[letter] || []), cur]
        return acc
      },
      {} as { [letter: string]: TOpt[] }
    )
  return (
    <>
      {Object.keys(items).map((letter: string) => (
        <div className="mb-12" key={letter}>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-[#C1DBF2] rounded-[50%] flex items-center justify-center">
              <BodyShort size="large" weight="semibold">
                {letter}
              </BodyShort>
            </div>
            <div className="w-full border-b-2 border-[#CBCBCB] border-solid" />
          </div>

          <HGrid gap="space-4" columns={4}>
            {items[letter].map((item: TOpt) => (
              <Box key={item.id}>
                <RouteLink href={`${baseUrl}${item.id}`}>{item.label}</RouteLink>
              </Box>
            ))}
          </HGrid>
        </div>
      ))}
    </>
  )
}

export default AlphabeticList
