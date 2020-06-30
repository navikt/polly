import React from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import {endsWith} from 'lodash'

/**
 * First paragraph in the markdown is rendered as a react fragment instead to avoid single word markdowns adding paragraph gutters
 */
const renderParagraph = (props: any) => {
  console.log(props)
  const ckey0 = props.children && props.children[0]?.key
  if (!endsWith(ckey0, '-1-1-0')) {
    return <p {...props}/>
  }
  return <React.Fragment {...props}/>
}

export const Markdown = (props: {source?: string, escapeHtml?: boolean}) => {

  return <ReactMarkdown source={props.source}
                        escapeHtml={props.escapeHtml}
                        linkTarget='_blank'
                        renderers={{
                          paragraph: renderParagraph
                        }}
  />


}
