import React from 'react'
import ReactMarkdown from 'react-markdown'
import {PluggableList} from 'react-markdown/lib/react-markdown'
import {ParagraphMedium} from 'baseui/typography'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

/**
 * singleWord true remove paragraph wrapper for content
 */
export const Markdown = ({singleWord, escapeHtml = true, verbatim, source}: { source?: string; escapeHtml?: boolean; singleWord?: boolean; verbatim?: boolean }) => {
  const renderers = {
    p: (parProps: any) => (singleWord ? <React.Fragment {...parProps} /> : verbatim ? <p {...parProps} /> : <ParagraphMedium {...parProps} />),
  }

  const htmlPlugins: PluggableList | any = escapeHtml ? [] : [rehypeRaw]
  return <ReactMarkdown children={source || ''} components={renderers} linkTarget="_blank" remarkPlugins={[remarkGfm]} rehypePlugins={htmlPlugins}/>
}
