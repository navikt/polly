import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { LabelLarge } from 'baseui/typography'
import { theme } from '../../util'
import RouteLink from './RouteLink'
import { margin } from './Style'

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
              <LabelLarge $style={{ fontSize: '1.2em' }}>{letter}</LabelLarge>
            </div>

            <div className="mb-6 mr-2.5" />
            <div className="w-full border-b-2 border-[#CBCBCB] border-solid" />
          </div>

          <FlexGrid
            flexGridRowGap={theme.sizing.scale600}
            flexGridColumnGap={theme.sizing.scale600}
            flexGridColumnCount={4}
          >
            {items[letter].map((item: TOpt) => (
              <FlexGridItem
                key={item.id}
                minWidth={'fit-content'}
                overrides={{
                  Block: {
                    style: {
                      ...margin('10px', '0'),
                      maxWidth: '25%',
                    },
                  },
                }}
              >
                <RouteLink href={`${baseUrl}${item.id}`}>{item.label}</RouteLink>
              </FlexGridItem>
            ))}
          </FlexGrid>
        </div>
      ))}
    </>
  )
}

export default AlphabeticList
