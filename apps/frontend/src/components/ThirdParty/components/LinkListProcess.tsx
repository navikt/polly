import { Fragment } from 'react/jsx-runtime'
import { EObjectType, IProcessShort } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

export const LinkListProcess = (
  items: IProcessShort[],
) => {
  const len = items.length

  return (
    <>
      {items.map((item: IProcessShort, index: number) => (
        <Fragment key={index}>
          <ObjectLink id={item.id} type={EObjectType.PROCESS}>
            {item.purposes.length > 0 ? item.purposes[0].shortName : ''}: {item.name}
          </ObjectLink>
          {index < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}

export default LinkListProcess
