import * as React from 'react'
import {InformationTypeShort, ObjectType, ProcessShort} from "../../../constants";
import {intl} from "../../../util";
import {ObjectLink} from "../../common/RouteLink";

export const LinkList = (items: (ProcessShort | InformationTypeShort)[], baseUrl: string, objectType: ObjectType) => {
  const len = items.length
  return (
    <>
      {len > 0 ? items.map((item, idx) =>
        <React.Fragment key={idx}>
          <ObjectLink id={item.id} type={objectType}>{item.name}</ObjectLink>
          {idx < len - 1 && <span>, </span>}
        </React.Fragment>
      ) : <>{intl.emptyMessage}</>}
    </>
  )
}

export default LinkList
