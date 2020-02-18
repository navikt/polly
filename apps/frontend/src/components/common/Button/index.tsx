import * as React from 'react'
import { Button as BaseUIButton, KIND, SIZE } from 'baseui/button'
import { StatefulTooltip, PLACEMENT } from 'baseui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


interface ButtonProps {
    kind?: KIND[keyof KIND];
    size?: SIZE[keyof SIZE];
    icon?: IconDefinition,
    tooltip?: string;
    children: React.ReactElement | string;
    onClick: () => void;
}

interface TooltipProps {
    tooltip?: string;
    children: React.ReactElement;
}

const Tooltip = (props: TooltipProps) => (
    props.tooltip ?
        <StatefulTooltip content={props.tooltip} placement={PLACEMENT.top}>{props.children}</StatefulTooltip>
    : props.children
)

const Button = (props: ButtonProps) => (
    <Tooltip tooltip={props.tooltip}>
        <BaseUIButton kind={props.kind} size={props.size} onClick={() => props.onClick()}>
            {props.icon && <FontAwesomeIcon icon={props.icon} style={{ marginRight: ".5rem" }} />} {props.children}
        </BaseUIButton>
    </Tooltip>
)

export default Button