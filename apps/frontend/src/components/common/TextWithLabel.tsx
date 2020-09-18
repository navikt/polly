import * as React from "react";
import {ReactNode} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {theme} from "../../util";
import {Block} from "baseui/block";
import {marginZero} from "./Style";
import {Label2} from "baseui/typography";
import CustomizedStatefulTooltip from "./CustomizedStatefulTooltip";

const TextWithLabel = (props: { label: string, text?: ReactNode, icon?: IconDefinition, iconColor?: string, error?: string, children?: ReactNode }) => {
  const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500}/>
  const value = props.text &&
    <Block font="ParagraphMedium"
           $style={{whiteSpace: 'pre-wrap', ...marginZero}}
           display="flex">
      {props.error && errorIcon} {props.text}
    </Block>

  return (
    <>
      <Label2 marginBottom={theme.sizing.scale100}>
        {props.icon && <FontAwesomeIcon icon={props.icon} color={props.iconColor}/>} {props.label}
      </Label2>
      {!props.error && value}
      {props.error && <CustomizedStatefulTooltip content={props.error}>{value}</CustomizedStatefulTooltip>}
      {props.children}
    </>
  )
}

export default TextWithLabel
