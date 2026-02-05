import { BodyLong, Label } from '@navikt/ds-react'
import { ReactNode } from 'react'

type TDataTextProps = {
  label?: string
  text?: false | string | string[]
  children?: ReactNode
  hideComponent?: boolean
}

const DataText = (props: TDataTextProps) => {
  const { hideComponent, text, children, label } = props
  const texts: false | string[] | undefined =
    typeof text === 'string' ? [text] : !!text || children ? text : ['Ikke utfylt']

  return (
    <>
      {!hideComponent && (
        <div className="flex content-start mb-4 w-full">
          <div className="w-[40%] max-w-75 pr-2.5">
            <Label>{label}</Label>
          </div>
          <div className="w-[60%]">
            {texts &&
              texts.map((text: string, index: number) => (
                <BodyLong
                  key={index}
                  style={{ wordBreak: 'break-word', marginTop: 0, marginBottom: 0 }}
                >
                  {text}
                </BodyLong>
              ))}
            {children && <div className="text-base ">{children}</div>}
          </div>
        </div>
      )}
    </>
  )
}

export default DataText
