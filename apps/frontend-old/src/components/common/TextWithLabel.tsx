import { XMarkOctagonIcon } from '@navikt/aksel-icons'
import { Button, Label, Tooltip } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { theme } from '../../util'

interface ITextWithLabelProps {
  label: string
  text?: ReactNode
  icon?: ReactNode
  iconColor?: string
  error?: string
  children?: ReactNode
  compact?: boolean
}

const TextWithLabel = (props: ITextWithLabelProps) => {
  const { text, error, icon, iconColor, label, children, compact } = props
  const errorIcon = (
    <span
      className="inline-flex items-center leading-none"
      style={{ color: theme.colors.negative500 }}
    >
      <XMarkOctagonIcon aria-hidden className="block" />
    </span>
  )

  const labelIcon = icon ? (
    <span
      className="inline-flex items-center leading-none"
      style={iconColor ? { color: iconColor } : undefined}
    >
      {icon}
    </span>
  ) : null

  const value = text && (
    <div className="whitespace-pre-wrap block m-0 text-base">
      {error && errorIcon} {text}
    </div>
  )

  return (
    <>
      <Label style={{ marginBottom: compact ? 0 : theme.sizing.scale100, display: 'block' }}>
        {labelIcon ? (
          <span className="inline-flex items-center gap-1">
            {labelIcon}
            <span>{label}</span>
          </span>
        ) : (
          label
        )}
      </Label>
      {!error && value}
      {error && (
        <Tooltip content={error}>
          <Button type="button" size="small" variant="tertiary-neutral">
            {value}
          </Button>
        </Tooltip>
      )}
      {children}
    </>
  )
}

export default TextWithLabel
