import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment, ReactNode } from 'react'
import { NavigableItem } from '../../constants'
import { Code, ListName, codelist } from '../../service/Codelist'
import { theme } from '../../util'
import { Markdown } from './Markdown'
import RouteLink, { urlForObject } from './RouteLink'

interface IDotTagProps {
  children: ReactNode
  wrapText?: boolean
}

export const DotTag = (props: IDotTagProps) => {
  const { children, wrapText } = props

  return (
    <>
      {wrapText && (
        <div className="mx-1 flex items-center">
          <div className="flex whitespace-normal">
            <div className="mr-1 mt-[-3px]">
              <FontAwesomeIcon icon={faCircle} color={theme.colors.positive400} style={{ fontSize: '.45rem' }} />
            </div>
            <div>{children}</div>
          </div>
        </div>
      )}
      <div className="mx-1 flex items-center">
        <FontAwesomeIcon icon={faCircle} color={theme.colors.positive400} style={{ fontSize: '.45rem' }} />
        <div className="inline mr-1" />
        <div className=" whitespace-nowrap">{props.children}</div>
      </div>
    </>
  )
}

interface IContentProps {
  item: string
  list?: ListName
  linkCodelist?: boolean
  markdown?: boolean
}

const Content = (props: IContentProps) => {
  const { item, list, linkCodelist, markdown } = props

  return (
    <>
      {list && (
        <>
          {linkCodelist && <RouteLink href={urlForObject(list as ListName & NavigableItem, item)}>{codelist.getShortname(list as ListName & NavigableItem, item)}</RouteLink>}
          {!linkCodelist && <>{codelist.getShortname(list, item)}</>}
        </>
      )}
      {!list && markdown && <Markdown source={item} singleWord />}
      {!list && !markdown && item}
    </>
  )
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
  const { commaSeparator, codes, noFlex, wrapText } = props
  const items = props.items || codes?.map((code) => code.code) || []

  return (
    <>
      {!items.length && <>Ikke angitt</>}
      {commaSeparator && items.length > 0 && (
        <div className="inline">
          {items.map((item: string, index: number) => (
            <Fragment key={index}>
              <Content {...props} item={item} />
              <span>{index < items.length - 1 ? ', ' : ''}</span>
            </Fragment>
          ))}
        </div>
      )}
      {!commaSeparator && items.length > 0 && (
        <div className={`${noFlex ? 'Block' : 'flex'} flex-wrap`}>
          {items.map((item: string, index: number) => (
            <div key={index} className={`${index < items.length ? 'mr-1.5' : '0px'}`}>
              <DotTag wrapText={wrapText}>
                {' '}
                <Content {...props} item={item} />{' '}
              </DotTag>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
