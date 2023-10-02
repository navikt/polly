import React from 'react'
import ReactMarkdown from 'react-markdown'
import {ParagraphMedium} from 'baseui/typography'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {StyledLink} from "baseui/link";

/**
 * singleWord true remove paragraph wrapper for content
 */
export const Markdown = ({singleWord, escapeHtml = true, verbatim, source}: { source?: string; escapeHtml?: boolean; singleWord?: boolean; verbatim?: boolean }) => {
  const renderers = {
    p: (parProps: any) => (singleWord ? <React.Fragment {...parProps} /> : verbatim ? <p {...parProps} /> : <ParagraphMedium {...parProps} />),
    a: (linkProps: any) => {
      const {children, href} = linkProps
      return <StyledLink href={href} target={"_blank"}>{children}</StyledLink>
    },
    href: (linkProps: any) => {
      const {children, href} = linkProps
      return <StyledLink href={href} target={"_blank"}>{children}</StyledLink>
    }
  }

  const htmlPlugins: any = escapeHtml ? [] : [rehypeRaw]
  return <ReactMarkdown children={source || ''} components={renderers} remarkPlugins={[remarkGfm]} rehypePlugins={htmlPlugins}/>
}
