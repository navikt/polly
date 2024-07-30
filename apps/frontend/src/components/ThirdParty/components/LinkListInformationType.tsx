import { Fragment } from 'react/jsx-runtime'
import { InformationTypeShort, ObjectType } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

export const LinkListInformationType = (items: InformationTypeShort[], baseUrl: string, objectType: ObjectType) => {
  const len = items.length

  return (
    <>
      {items.map((item, idx) => (
        <Fragment key={idx}>
          <ObjectLink id={item.id} type={ObjectType.INFORMATION_TYPE}>
            {item.name}
          </ObjectLink>
          {idx < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}

export default LinkListInformationType
