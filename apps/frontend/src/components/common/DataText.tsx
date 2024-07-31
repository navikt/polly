import { LabelMedium, ParagraphMedium } from 'baseui/typography'
import { ReactNode } from 'react'

type DataTextProps = {
  label?: string
  text?: false | string | string[]
  children?: ReactNode
  hideComponent?: boolean
}

const DataText = (props: DataTextProps) => {
  const { hideComponent, text, children, label } = props
  const texts: false | string[] | undefined = typeof text === 'string' ? [text] : !!text || children ? text : ['Ikke utfylt']

  return (
    <>
      {hideComponent && null}
      {!hideComponent && (
        <div className="flex content-start mb-4 w-full">
          <div className="w-[40%] pr-2.5 max-w-[300px]">
            <LabelMedium>{label}</LabelMedium>
          </div>
          <div className="w-[60%]">
            {texts &&
              texts.map((text: string, index: number) => (
                <ParagraphMedium marginTop="0" marginBottom="0" key={index} $style={{ wordBreak: 'break-word' }}>
                  {text}
                </ParagraphMedium>
              ))}
            {children && <div className="text-base ">{children}</div>}
          </div>
        </div>
      )}
    </>
  )
}

export default DataText
