import { LabelMedium, ParagraphMedium } from 'baseui/typography'
import { ReactNode } from 'react'

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
    <div className="flex content-start mb-4 w-full">
      <div className="w-[40%] pr-2.5 max-w-[300px]">
        <LabelMedium>{props.label}</LabelMedium>
      </div>
      <div className="w-[60%]">
        {texts &&
          texts.map((text, index) => (
            <ParagraphMedium marginTop="0" marginBottom="0" key={index} $style={{ wordBreak: 'break-word' }}>
              {text}
            </ParagraphMedium>
          ))}
        {props.children && <div className="text-base ">{props.children}</div>}
      </div>
    </div>
  )
}

export default DataText
