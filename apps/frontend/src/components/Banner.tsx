import * as React from 'react'
import { Block, BlockProps } from 'baseui/block'
import { Heading, HeadingLevel } from 'baseui/heading'
import { user } from '../service/User'
import { InformationTypeBannerButtons } from './InformationType/InformationTypeBannerButtons'

type BannerProps = {
  title: string | any | null
  informationtypeId?: string
}

const bannerBlockProps: BlockProps = {
  backgroundColor: 'mono200',
  width: 'calc(100vw - 8px)',
  left: 'calc(-50vw + 50%)',
  position: 'relative',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  marginBottom: '2rem',
}

const bannerContentProps: BlockProps = {
  width: '80%',
  margin: '0 auto',
  display: 'flex',
}

const Banner = ({ title, informationtypeId }: BannerProps) => {
  return (
    <Block {...bannerBlockProps}>
      <Block {...bannerContentProps} justifyContent="space-between">
        <HeadingLevel>
          <Heading styleLevel={5} marginRight="auto" marginLeft="auto">
            {title}
          </Heading>
        </HeadingLevel>
        {user.canWrite() && informationtypeId ? <InformationTypeBannerButtons id={informationtypeId} /> : <Block></Block>}
      </Block>
    </Block>
  )
}

export default Banner
