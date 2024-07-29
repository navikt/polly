import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactNode } from 'react'
import { NavigableItem } from '../../constants'
import { Code, codelist, ListName } from '../../service/Codelist'
import { theme } from '../../util'
import { Markdown } from './Markdown'
import RouteLink, { urlForObject } from './RouteLink'

export const DotTag = (props: { children: ReactNode; wrapText?: boolean }) => {
  if (props.wrapText) {
    return (
      <div className="mx-1 flex items-center">
        <div className="flex whitespace-normal">
          <div className="mr-1 mt-[-3px]">
            <FontAwesomeIcon icon={faCircle} color={theme.colors.positive400} style={{ fontSize: '.45rem' }} />
          </div>
          <div>{props.children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-1 flex items-center">
      <FontAwesomeIcon icon={faCircle} color={theme.colors.positive400} style={{ fontSize: '.45rem' }} />
      <div className="inline mr-1" />
      <div className=" whitespace-nowrap">{props.children}</div>
    </div>
  )
}

const Content = (props: { item: string; list?: ListName; linkCodelist?: boolean; markdown?: boolean }) => {
  const { item, list, linkCodelist, markdown } = props
  if (list) {
    if (linkCodelist) return <RouteLink href={urlForObject(list as ListName & NavigableItem, item)}>{codelist.getShortname(list as ListName & NavigableItem, item)}</RouteLink>
    return <>{codelist.getShortname(list, item)}</>
  }
  if (markdown) return <Markdown source={item} singleWord />
  return <>{item}</>
}

type DotTagsParams = {
  items?: string[]
  codes?: Code[]
  commaSeparator?: boolean
  linkCodelist?: boolean
  markdown?: boolean
  list?: ListName
  noFlex?: boolean
  wrapText?: boolean
}

export const DotTags = (props: DotTagsParams) => {
  const { commaSeparator } = props
  const items = props.items || props.codes?.map((c) => c.code) || []

  if (!items.length) return <>Ikke angitt</>

  if (commaSeparator)
    return (
      <div className="inline">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <Content {...props} item={item} />
            <span>{i < items.length - 1 ? ', ' : ''}</span>
          </React.Fragment>
        ))}
      </div>
    )

  return (
    <div className={`${props.noFlex ? 'Block' : 'flex'} flex-wrap`}>
      {items.map((item, i) => (
        <div key={i} className={`${i < items.length && !commaSeparator ? 'mr-1.5' : '0px'}`}>
          <DotTag wrapText={props.wrapText}>
            {' '}
            <Content {...props} item={item} />{' '}
          </DotTag>
        </div>
      ))}
    </div>
  )
}
