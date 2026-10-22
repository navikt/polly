import { BodyLong, Label } from '@navikt/ds-react'
import { ReactNode } from 'react'

type TDataTextProps = {
  label?: string
  badge?: ReactNode
  text?: false | string | string[]
  children?: ReactNode
  hideComponent?: boolean
  labelMarginLeft?: boolean
}

const DataText = (props: TDataTextProps) => {
  const { hideComponent, text, children, label, badge, labelMarginLeft } = props
  const texts: false | string[] | undefined =
    typeof text === 'string'
      ? text.length
        ? [text]
        : false
      : Array.isArray(text)
        ? text.filter((t) => t)
        : !!text || children
          ? text
          : ['Ikke utfylt']

  return (
    <>
      {!hideComponent && (
        <div className='flex content-start mb-4 w-full'>
          <div className='w-[40%] max-w-75 pr-2.5'>
            <div className='flex'>
              {badge}
              <Label className={`${labelMarginLeft ? 'ml-5' : ''}`}>{label}</Label>
            </div>
          </div>
          <div className='w-[60%]'>
            {texts &&
              texts.map((text: string, index: number) => (
                <BodyLong
                  key={index}
                  style={{ wordBreak: 'break-word', marginTop: 0, marginBottom: 0 }}
                >
                  {text}
                </BodyLong>
              ))}
            {children && <div>{children}</div>}
          </div>
        </div>
      )}
    </>
  )
}

export default DataText
