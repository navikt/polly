import { Fragment } from 'react/jsx-runtime'
import { EObjectType, IInformationTypeShort } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

// Disse verdiene blir sendt ned, men aldri brukt
export const LinkListInformationType = (
  items: IInformationTypeShort[],
  baseUrl: string,
  objectType: EObjectType
) => {
  const len = items.length

  return (
    <>
      {items.map((item: IInformationTypeShort, index: number) => (
        <Fragment key={index}>
          <ObjectLink id={item.id} type={EObjectType.INFORMATION_TYPE}>
            {item.name}
          </ObjectLink>
          {index < len - 1 && <span>, </span>}
        </Fragment>
      ))}
    </>
  )
}

export default LinkListInformationType
