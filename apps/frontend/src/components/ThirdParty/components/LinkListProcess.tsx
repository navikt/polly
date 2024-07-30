import { Fragment } from 'react/jsx-runtime'
import { ObjectType, ProcessShort } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

export const LinkListProcess = (items: ProcessShort[], baseUrl: string, objectType: ObjectType) => {
  const len = items.length
  return (
    <>
      {items.map((item, idx) => (
        <Fragment key={idx}>
          <ObjectLink id={item.id} type={ObjectType.PROCESS}>
            {item.purposes.length > 0 ? item.purposes[0].shortName : ''}: {item.name}
          </ObjectLink>
          {idx < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}

export default LinkListProcess
