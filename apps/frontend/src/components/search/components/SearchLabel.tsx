import { Block } from 'baseui/block'
import { default as React } from 'react'

export const SearchLabel = (props: { name: string; type: string; backgroundColor?: string; foregroundColor?: string }) => (
  <Block display="flex" justifyContent="space-between" width="100%">
    <span style={{ padding: '5px' }}>{props.name}</span>
    <Block $style={{ backgroundColor: props.backgroundColor, padding: '5px', margin: '5px', borderRadius: '5px' }}>{props.type}</Block>
  </Block>
)
