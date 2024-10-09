import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as NavButton, Tooltip as NavTooltip } from '@navikt/ds-react'
import { ReactElement, ReactNode } from 'react'

interface IButtonProps {
  kind?:
    | 'primary'
    | 'primary-neutral'
    | 'secondary'
    | 'secondary-neutral'
    | 'tertiary'
    | 'tertiary-neutral'
    | 'danger'
    | 'outline'
  type?: 'submit' | 'reset' | 'button'
  size?: 'small' | 'medium' | 'xsmall'
  icon?: IconDefinition
  iconEnd?: IconDefinition
  inline?: boolean
  tooltip?: string
  children?: ReactNode
  onClick?: () => void
  startEnhancer?: ReactNode
  disabled?: boolean
  marginRight?: boolean
  marginLeft?: boolean
}

interface ITooltipProps {
  tooltip?: string
  children: ReactElement
}

const Tooltip = (props: ITooltipProps) =>
  props.tooltip ? <NavTooltip content={props.tooltip}>{props.children}</NavTooltip> : props.children

const Button = (props: IButtonProps) => {
  const baseuiKind = props.kind === 'outline' ? 'secondary' : props.kind

  return (
    <>
      <div className={`inline ${props.marginLeft ? 'ml-2.5' : ''}`} />
      <Tooltip tooltip={props.tooltip}>
        <NavButton
          variant={baseuiKind}
          size={props.size}
          onClick={() => props.onClick?.()}
          icon={props.startEnhancer}
          disabled={props.disabled}
          type={props.type}
        >
          {props.icon && (
            <FontAwesomeIcon
              icon={props.icon}
              style={{ marginRight: props.children ? '.5rem' : undefined }}
            />
          )}
          {props.children}
          {props.iconEnd && (
            <FontAwesomeIcon
              icon={props.iconEnd}
              style={{ marginLeft: props.children ? '.5rem' : undefined }}
            />
          )}
        </NavButton>
      </Tooltip>
      <div className={`inline ${props.marginRight ? 'mr-2.5' : ''}`} />
    </>
  )
}

export default Button
