import { BodyLong, Heading, List } from '@navikt/ds-react'
import { StyledLink } from 'baseui/link'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

/**
 * singleWord true remove paragraph wrapper for content
 */
export const Markdown = ({
  singleWord,
  escapeHtml = true,
  verbatim,
  source,
}: {
  source?: string
  escapeHtml?: boolean
  singleWord?: boolean
  verbatim?: boolean
}) => {
  const renderers = {
    a: (linkProps: any) => {
      const { children, href } = linkProps
      return (
        <StyledLink href={href} target={'_blank'}>
          {children}
        </StyledLink>
      )
    },
    p: (parProps: any) => {
      const { children } = parProps
      return <BodyLong>{children}</BodyLong>
    },
    h2: (headerProps: any) => {
      const { children } = headerProps

      return (
        <Heading size="medium" level="2">
          {children}
        </Heading>
      )
    },

    h3: (headerProps: any) => {
      const { children } = headerProps

      return (
        <Heading size="small" level="3">
          {children}
        </Heading>
      )
    },
    h4: (headerProps: any) => {
      const { children } = headerProps

      return (
        <Heading size="xsmall" level="4">
          {children}
        </Heading>
      )
    },
    href: (linkProps: any) => {
      const { children, href } = linkProps
      return (
        <StyledLink href={href} target={'_blank'}>
          {children}
        </StyledLink>
      )
    },
    li: (liProps: any) => {
      const { children } = liProps
      return <List.Item className="ml-4">{children}</List.Item>
    },
    ul: (ulProps: any) => {
      const { children } = ulProps
      return <List>{children}</List>
    },
  }
  const htmlPlugins: any = escapeHtml ? [] : [rehypeRaw]
  return (
    <ReactMarkdown
      children={source || ''}
      components={renderers}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={htmlPlugins}
    />
  )
}
