import { Block } from 'baseui/block'
import { default as React } from 'react'

export const SearchLabel = (props: { name: string; type: string; backgroundColor?: string; foregroundColor?: string }) => (
  <div className="flex justify-between w-full">
    <span style={{ padding: '5px' }}>{props.name}</span>
    <div className={`p-[5px] m-[5px] border-r-[5px] ${props.backgroundColor ? `{bg-[${props.backgroundColor}]}` : ''}`}>{props.type}</div>
  </div>
)
