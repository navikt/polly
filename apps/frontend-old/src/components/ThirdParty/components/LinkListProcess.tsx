import { EObjectType, IProcessShort } from '../../../constants'
import { ObjectLink } from '../../common/RouteLink'

export const LinkListProcess = (items: IProcessShort[]) => {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item: IProcessShort, index: number) => (
        <div key={item.id ?? index}>
          <ObjectLink id={item.id} type={EObjectType.PROCESS}>
            {item.purposes.length > 0 ? item.purposes[0].shortName : ''}: {item.name}
          </ObjectLink>
        </div>
      ))}
    </div>
  )
}

export default LinkListProcess
