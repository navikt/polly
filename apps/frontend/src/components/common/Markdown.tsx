import React from 'react'
import ReactMarkdown from 'react-markdown/with-html'

/**
 * singleWord true remove paragraph wrapper for content
 */
export const Markdown = (props: {source?: string, escapeHtml?: boolean, singleWord?: boolean}) =>
  <ReactMarkdown source={props.source}
                 escapeHtml={props.escapeHtml}
                 linkTarget='_blank'
                 renderers={{
                   paragraph: (parProps: any) => props.singleWord ? <React.Fragment {...parProps}/> : <p {...parProps}/>
                 }}
  />
