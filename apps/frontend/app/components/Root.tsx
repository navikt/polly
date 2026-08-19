import { JSX } from 'react'

interface IRootProps {
  children: JSX.Element | Array<JSX.Element>
}

const Root = ({ children }: IRootProps): JSX.Element => {
  return <div>{children}</div>
}

export default Root
