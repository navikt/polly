import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tooltip } from '@navikt/ds-react'
import { LabelMedium } from 'baseui/typography'
import { ReactNode } from 'react'
import { theme } from '../../util'

interface ITextWithLabelProps {
  label: string
  text?: ReactNode
  icon?: IconDefinition
  iconColor?: string
  error?: string
  children?: ReactNode
}

const TextWithLabel = (props: ITextWithLabelProps) => {
  const { text, error, icon, iconColor, label, children } = props
  const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500} />
  const value = text && (
    <div className="whitespace-pre-wrap block m-0 text-base">
      {error && errorIcon} {text}
    </div>
  )

  return (
    <>
      <LabelMedium marginBottom={theme.sizing.scale100}>
        {icon && <FontAwesomeIcon icon={icon} color={iconColor} />} {label}
      </LabelMedium>
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
