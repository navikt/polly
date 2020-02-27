import React, { ReactNode } from 'react'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { Block } from 'baseui/block'
import { theme } from '../../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export const DotTag = (props: { children: ReactNode }) =>
  <Block marginLeft={theme.sizing.scale100} marginRight={theme.sizing.scale100} display='flex' alignItems='center'>
    <FontAwesomeIcon icon={faCircle} color={theme.colors.positive400} style={{fontSize: '.45rem'}}/>
    <Block display='inline' marginRight={theme.sizing.scale100}/>
    <Block $style={{whiteSpace: 'nowrap'}}>
      {props.children}
    </Block>
  </Block>

export const DotTags = (props: { items?: string[] }) => {
  const items = props.items || []
  return (
    <Block display='flex' flexWrap>
      {items.map((item, i) => (
        <Block key={i} marginRight={i < items.length ? theme.sizing.scale200 : 0}>
          <DotTag>{item}</DotTag>
        </Block>
      ))}
    </Block>
  )
}
