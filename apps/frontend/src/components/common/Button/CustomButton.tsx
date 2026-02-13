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
  icon?: ReactNode
  iconEnd?: ReactNode
  inline?: boolean
  tooltip?: string
  children?: ReactNode
  onClick?: () => void
  startEnhancer?: ReactNode
  disabled?: boolean
  marginRight?: boolean
  marginLeft?: boolean
  ariaLabel?: string
  loading?: boolean
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
      <div
        className={`inline ${props.marginLeft ? 'ml-2.5' : ''} ${props.marginRight ? 'mr-2.5' : ''}`}
      />
      <Tooltip tooltip={props.tooltip}>
        <NavButton
          variant={baseuiKind}
          size={props.size}
          onClick={() => props.onClick?.()}
          icon={props.icon ?? props.startEnhancer}
          disabled={props.disabled}
          loading={props.loading}
          type={props.type}
          aria-label={props.ariaLabel}
        >
          {(props.children || props.iconEnd) && (
            <span className="inline-flex items-center gap-2">
              {props.children}
              {props.iconEnd}
            </span>
          )}
        </NavButton>
      </Tooltip>
      <div className={`inline ${props.marginRight ? 'mr-2.5' : ''}`} />
    </>
  )
}

export default Button
