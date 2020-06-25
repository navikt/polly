import {Code, codelist, ListName} from '../../service/Codelist'
import * as React from 'react'
import RouteLink, {urlForObject} from './RouteLink'
import {NavigableItem} from '../../constants'
import {Block} from 'baseui/block'


export const CodesLinks = (props: {list: ListName & NavigableItem, codes?: Code[] | string[], code?: string}) => {
  const {list, codes, code} = props
  const codesString: string[] = !!code ? [code] :
    codes?.length && typeof codes[0] === 'object' ? (codes as Code[]).map(c => c.code) : codes as string[]
  return (
    <Block>
      {codesString.map((code, index) => (
        <React.Fragment key={index}>
          <RouteLink href={urlForObject(list, code)}>
            {codelist.getShortname(list, code)}
          </RouteLink>
          <span>{index < codesString.length - 1 ? ', ' : ''}</span>
        </React.Fragment>
      ))}
    </Block>
  )
}
