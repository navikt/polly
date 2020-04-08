import {default as React, ReactNode} from 'react'
import {Block} from 'baseui/block'
import {theme} from '../../../util'
import {Label2, Paragraph2} from 'baseui/typography'

type DataTextProps = {
  label?: string
  text?: false | string | string[]
  children?: ReactNode
  hide?: boolean
}

const DataText = (props: DataTextProps) => {
  if (props.hide) return null
  const texts = typeof props.text === 'string' ? [props.text] : props.text

  return (
    <Block display='flex' alignContent='flex-start' marginBottom='1rem' width='100%'>
      <Block width='40%' paddingRight={theme.sizing.scale400}>
        <Label2>{props.label}</Label2>
      </Block>
      <Block width='60%'>
        {texts && texts.map((text, index) =>
          <Paragraph2 marginTop='0' marginBottom='0' key={index}>
            {text}
          </Paragraph2>
        )}
        {props.children &&
        <Block font='ParagraphMedium'>
          {props.children}
        </Block>}
      </Block>
    </Block>
  )
}

export default DataText
