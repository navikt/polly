import { EObjectType, IInformationTypeShort } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

// Disse verdiene blir sendt ned, men aldri brukt
export const LinkListInformationType = (items: IInformationTypeShort[]) => {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item: IInformationTypeShort, index: number) => (
        <div key={item.id ?? index}>
          <ObjectLink id={item.id} type={EObjectType.INFORMATION_TYPE}>
            {item.name}
          </ObjectLink>
        </div>
      ))}
    </div>
  )
}

export default LinkListInformationType
