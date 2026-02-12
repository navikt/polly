import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Label, Tooltip } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { theme } from '../../util'

interface ITextWithLabelProps {
  label: string
  text?: ReactNode
  icon?: IconDefinition
  iconColor?: string
  error?: string
  children?: ReactNode
  compact?: boolean
}

const TextWithLabel = (props: ITextWithLabelProps) => {
  const { text, error, icon, iconColor, label, children, compact } = props
  const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500} />
  const value = text && (
    <div className="whitespace-pre-wrap block m-0 text-base">
      {error && errorIcon} {text}
    </div>
  )

  return (
    <>
      <Label style={{ marginBottom: compact ? 0 : theme.sizing.scale100, display: 'block' }}>
        {icon && <FontAwesomeIcon icon={icon} color={iconColor} />} {label}
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
