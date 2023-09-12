import * as React from 'react'
import { Block } from 'baseui/block'
import { theme } from '../../util'
import { primitives } from '../../util/theme'
import { LabelLarge } from 'baseui/typography'
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid'
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
        <Block key={letter} marginBottom={theme.sizing.scale800}>
          <Block display="flex" alignItems="center" marginBottom={theme.sizing.scale800}>
            <Block
              width={theme.sizing.scale900}
              height={theme.sizing.scale900}
              backgroundColor={primitives.primary150}
              $style={{ borderRadius: '50%' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LabelLarge $style={{ fontSize: '1.2em' }}>{letter}</LabelLarge>
            </Block>

            <Block marginBottom={theme.sizing.scale800} marginRight={theme.sizing.scale400} />
            <Block width="100%" $style={{ borderBottomStyle: 'solid', borderBottomColor: theme.colors.mono500, borderBottomWidth: '2px' }} />
          </Block>

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
        </Block>
      ))}
    </>
  )
}

export default AlphabeticList
