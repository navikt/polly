import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
import { LabelLarge } from 'baseui/typography'
import { theme } from '../../util'
import RouteLink from './RouteLink'
import { margin } from './Style'

type Opt = { id: string; label: string }
const AlphabeticList = (props: { items: Opt[]; baseUrl: string }) => {
  const items = props.items
    .sort((a, b) => a.label.localeCompare(b.label))
    .reduce(
      (acc, cur) => {
        const letter = cur.label.toUpperCase()[0]
        acc[letter] = [...(acc[letter] || []), cur]
        return acc
      },
      {} as { [letter: string]: Opt[] },
    )
  return (
    <>
      {Object.keys(items).map((letter) => (
        <div className="mb-12" key={letter}>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-[#C1DBF2] rounded-[50%] flex items-center justify-center">
              <LabelLarge $style={{ fontSize: '1.2em' }}>{letter}</LabelLarge>
            </div>

            <div className="mb-6 mr-2.5" />
            <div className="w-full border-b-2 border-[#CBCBCB] border-solid" />
          </div>

          <FlexGrid flexGridRowGap={theme.sizing.scale600} flexGridColumnGap={theme.sizing.scale600} flexGridColumnCount={4}>
            {items[letter].map((item) => (
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
                <RouteLink href={`${props.baseUrl}${item.id}`}>{item.label}</RouteLink>
              </FlexGridItem>
            ))}
          </FlexGrid>
        </div>
      ))}
    </>
  )
}

export default AlphabeticList
