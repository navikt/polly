import * as React from 'react'
import { ReactNode } from 'react'
import { Button as BaseUIButton, KIND, SHAPE, SIZE } from 'baseui/button'
import { PLACEMENT, StatefulTooltip } from 'baseui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { theme } from "../../../util"
import { Override } from 'baseui/overrides';


interface ButtonProps {
  kind?: KIND[keyof KIND] | 'outline'
  size?: SIZE[keyof SIZE]
  shape?: SHAPE[keyof SHAPE]
  icon?: IconDefinition
  inline?: boolean
  tooltip?: string
  children: ReactNode
  onClick?: () => void
  startEnhancer?: ReactNode
  disabled?: boolean
}

interface TooltipProps {
  tooltip?: string
  children: React.ReactElement
}

const Tooltip = (props: TooltipProps) => (
  props.tooltip ?
    <StatefulTooltip content={props.tooltip} placement={PLACEMENT.top}>{props.children}</StatefulTooltip>
    : props.children
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
    borderBottomStyle: outlineStyle
  }
}

const Button = (props: ButtonProps) => {
  const baseuiKind = props.kind === 'outline' ? KIND.secondary : props.kind
  const overrides: Override<any> = {
    style: {
      ...(props.kind === 'outline' ? outlineOverride.style : {}),
      ...(props.inline ? {paddingTop: theme.sizing.scale100, paddingBottom: theme.sizing.scale100} : {})
    }
  }
  return (
    <Tooltip tooltip={props.tooltip}>
      <BaseUIButton kind={baseuiKind} size={props.size} shape={props.shape} onClick={() => props.onClick?.()} overrides={{BaseButton: overrides}}
                    startEnhancer={props.startEnhancer} disabled={props.disabled}
      >
        {props.icon && <FontAwesomeIcon icon={props.icon} style={{marginRight: ".5rem"}}/>} {props.children}
      </BaseUIButton>
    </Tooltip>
  )
}

export default Button
