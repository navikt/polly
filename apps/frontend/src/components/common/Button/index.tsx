import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as BaseUIButton, KIND, SHAPE, SIZE } from 'baseui/button'
import { Override } from 'baseui/overrides'
import { ReactElement, ReactNode } from 'react'
import { StyleObject } from 'styletron-react'
import { theme } from '../../../util'
import CustomizedStatefulTooltip from '../CustomizedStatefulTooltip'

interface IButtonProps {
  kind?: (typeof KIND)[keyof typeof KIND] | 'outline'
  type?: 'submit' | 'reset' | 'button'
  size?: (typeof SIZE)[keyof typeof SIZE]
  shape?: (typeof SHAPE)[keyof typeof SHAPE]
  icon?: IconDefinition
  iconEnd?: IconDefinition
  inline?: boolean
  tooltip?: string
  children?: ReactNode
  onClick?: () => void
  startEnhancer?: ReactNode
  disabled?: boolean
  $style?: StyleObject
  marginRight?: boolean
  marginLeft?: boolean
}

interface ITooltipProps {
  tooltip?: string
  children: ReactElement
}

const Tooltip = (props: ITooltipProps) =>
  props.tooltip ? (
    <CustomizedStatefulTooltip content={props.tooltip}>{props.children}</CustomizedStatefulTooltip>
  ) : (
    props.children
  )

const outlineWidth = '2px'
const outlineStyle = 'solid'
const outlineOverride: Override<any> = {
  style: {
    borderColor: theme.colors.buttonPrimaryFill,
    backgroundColor: 'inherit',
    borderLeftWidth: outlineWidth,
    borderRightWidth: outlineWidth,
    borderTopWidth: outlineWidth,
    borderBottomWidth: outlineWidth,
    borderLeftStyle: outlineStyle,
    borderRightStyle: outlineStyle,
    borderTopStyle: outlineStyle,
    borderBottomStyle: outlineStyle,
  },
}

const Button = (props: IButtonProps) => {
  const baseuiKind = props.kind === 'outline' ? KIND.secondary : props.kind
  const overrides: Override<any> = {
    style: {
      ...(props.kind === 'outline' ? outlineOverride.style : {}),
      ...(props.inline
        ? { paddingTop: theme.sizing.scale100, paddingBottom: theme.sizing.scale100 }
        : {}),
      ...(props.$style || {}),
    },
  }
  return (
    <>
      <div className={`inline ${props.marginLeft ? 'ml-2.5' : ''}`} />
      <Tooltip tooltip={props.tooltip}>
        <BaseUIButton
          kind={baseuiKind}
          size={props.size}
          shape={props.shape}
          onClick={() => props.onClick?.()}
          overrides={{ BaseButton: overrides }}
          startEnhancer={props.startEnhancer}
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
        </BaseUIButton>
      </Tooltip>
      <div className={`inline ${props.marginRight ? 'mr-2.5' : ''}`} />
    </>
  )
}

export default Button
