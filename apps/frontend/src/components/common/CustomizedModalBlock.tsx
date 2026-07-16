import { Children, ReactNode } from 'react'

interface IProps {
  children: ReactNode
  first?: boolean
}

const CustomizedModalBlock = (props: IProps) => {
  const { first, children } = props
  const childArray = Children.toArray(children)

  return (
    <div
      className={`flex w-full min-w-full mb-4 pt-4 ${!first ? 'border-t border-solid border-[#E2E2E2]' : ''}`}
    >
      {childArray.map((child, index) =>
        index === 0 ? (
          child
        ) : (
          <div key={index} className="flex-1 min-w-0">
            {child}
          </div>
        )
      )}
    </div>
  )
}

export default CustomizedModalBlock
