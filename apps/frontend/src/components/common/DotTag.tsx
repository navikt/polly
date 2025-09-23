import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyLong } from '@navikt/ds-react'
import { Fragment, ReactNode } from 'react'
import { TNavigableItem } from '../../constants'
import { EListName, ICode, ICodelistProps } from '../../service/Codelist'
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
              <FontAwesomeIcon
                icon={faCircle}
                color={theme.colors.positive400}
                style={{ fontSize: '.45rem' }}
              />
            </div>
            <div>{children}</div>
          </div>
        </div>
      )}
      <div className="mx-1 flex items-center">
        <FontAwesomeIcon
          icon={faCircle}
          color={theme.colors.positive400}
          style={{ fontSize: '.45rem' }}
        />
        <div className="inline mr-1" />
        <div>{props.children}</div>
      </div>
    </>
  )
}

interface IContentProps {
  item: string
  list?: EListName
  linkCodelist?: boolean
  markdown?: boolean
  customId?: string
  codelistUtils: ICodelistProps
}

const Content = (props: IContentProps) => {
  const { item, list, linkCodelist, markdown, customId, codelistUtils } = props

  return (
    <div className="break-words">
      {list && (
        <>
          {linkCodelist && (
            <RouteLink
              href={urlForObject(list as EListName & TNavigableItem, customId ? customId : item)}
            >
              {codelistUtils.getShortname(list as EListName & TNavigableItem, item)}
            </RouteLink>
          )}
          {!linkCodelist && <>{codelistUtils.getShortname(list, item)}</>}
        </>
      )}
      {!list && markdown && <Markdown source={item} />}
      {!list && !markdown && <BodyLong className="break-word">{item}</BodyLong>}
    </div>
  )
}

type TDotTagsParams = {
  items?: string[]
  codes?: ICode[]
  commaSeparator?: boolean
  linkCodelist?: boolean
  markdown?: boolean
  list?: EListName
  noFlex?: boolean
  wrapText?: boolean
  codelistUtils: ICodelistProps
  customId?: string
}

export const DotTags = (props: TDotTagsParams) => {
  const { commaSeparator, codes, noFlex, wrapText, codelistUtils } = props
  const items = props.items || codes?.map((code) => code.code) || []

  return (
    <>
      {!items.length && <>Ikke angitt</>}
      {commaSeparator && items.length > 0 && (
        <div className="inline">
          {items.map((item: string, index: number) => (
            <Fragment key={index}>
              <Content {...props} codelistUtils={codelistUtils} item={item} />
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
                <Content {...props} codelistUtils={codelistUtils} item={item} />{' '}
              </DotTag>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
