import { useStyletron } from 'baseui'
import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
  first?: boolean
}

const CustomizedModalBlock = (props: IProps) => {
  const { first, children } = props
  const [css] = useStyletron()
  return (
    <div
      className={`flex w-full min-w-full mb-4 pt-4 ${!first ? 'border-t border-solid border-[#E2E2E2]' : ''}`}
    >
      {children}
    </div>
  )
}

export default CustomizedModalBlock
