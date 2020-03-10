import {Block, BlockProps} from 'baseui/block'
import * as React from 'react'
import {useStyletron} from 'baseui'

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
};

const CustomizedModalBlock = (props:BlockProps) =>{
  const [css] = useStyletron()
  return (
    <Block display='flex' minWidth='100%'  paddingBottom={'1rem'} {...rowBlockProps}
           overrides={{
             Block:
               {props:
                   {className:css({
                       borderBottom: '1px solid #E2E2E2'
                     })}
               }
           }}
    >
      {props.children}
    </Block>
  )
}

export default CustomizedModalBlock
