import * as React from 'react'
import { InformationTypeShort, ObjectType } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

export const LinkListInformationType = (items: InformationTypeShort[], baseUrl: string, objectType: ObjectType) => {
  const len = items.length
  return (
    <>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ObjectLink id={item.id} type={ObjectType.INFORMATION_TYPE}>
            {item.name}
          </ObjectLink>
          {idx < len - 1 && <span>, </span>}
        </React.Fragment>
      ))}
    </>
  )
}

export default LinkListInformationType
