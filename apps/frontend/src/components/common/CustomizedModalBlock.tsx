import { Block, BlockProps } from 'baseui/block'
import * as React from 'react'
import { useStyletron } from 'baseui'

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  minWidth: '100%',
  marginBottom: '1rem',
  paddingTop: '1rem',
}

const CustomizedModalBlock = (props: { children: React.ReactNode; first?: boolean }) => {
  const [css] = useStyletron()
  return (
    <Block
      {...rowBlockProps}
      overrides={{
        Block: {
          props: {
            className: css({
              borderTop: !props.first ? '1px solid #E2E2E2' : undefined,
            }),
          },
        },
      }}
    >
      {props.children}
    </Block>
  )
}

export default CustomizedModalBlock
