import * as React from 'react'
import {StyledLink} from "baseui/link";
import {ProcessShort} from "../../../constants";
import {intl} from "../../../util";

export const LinkListProcessShort = (items:ProcessShort[], baseUrl:string) => {
  const len = items.length
  return (
    <>
      {len > 0 ?items.map((item, idx) =>
        <React.Fragment key={idx}>
          <StyledLink href={`${baseUrl}/${item.purposes[0].code}/${item.id}`}
                      target="_blank" rel="noopener noreferrer">
            {item.name}
          </StyledLink>
          {idx < len - 1 && <span>, </span>}
        </React.Fragment>
      ):<>{intl.emptyMessage}</>}
    </>
  )
}

export default LinkListProcessShort
