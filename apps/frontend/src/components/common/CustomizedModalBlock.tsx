import { useStyletron } from 'baseui'
import * as React from 'react'

const CustomizedModalBlock = (props: { children: React.ReactNode; first?: boolean }) => {
  const [css] = useStyletron()
  return <div className={`flex w-full min-w-full mb-4 pt-4 ${!props.first ? 'border-t border-solid border-[#E2E2E2]' : ''}`}>{props.children}</div>
}

export default CustomizedModalBlock
