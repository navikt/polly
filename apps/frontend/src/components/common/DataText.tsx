import { default as React, ReactNode } from 'react'
import { Block } from 'baseui/block'
import { theme } from '../../util'
import { LabelMedium, ParagraphMedium } from 'baseui/typography'

type DataTextProps = {
  label?: string
  text?: false | string | string[]
  children?: ReactNode
  hideComponent?: boolean
}

const DataText = (props: DataTextProps) => {
  if (props.hideComponent) return null
  const texts = typeof props.text === 'string' ? [props.text] : !!props.text || props.children ? props.text : ['Ikke utfylt']
  return (
    <Block display="flex" alignContent="flex-start" marginBottom="1rem" width="100%">
      <Block width="40%" paddingRight={theme.sizing.scale400} maxWidth="300px">
        <LabelMedium>{props.label}</LabelMedium>
      </Block>
      <Block width="60%">
        {texts &&
          texts.map((text, index) => (
            <ParagraphMedium marginTop="0" marginBottom="0" key={index} $style={{ wordBreak: 'break-word' }}>
              {text}
            </ParagraphMedium>
          ))}
        {props.children && <Block font="ParagraphMedium">{props.children}</Block>}
      </Block>
    </Block>
  )
}

export default DataText
