import {intl} from "../../util"
import {Radio, RadioGroup} from "baseui/radio"
import * as React from "react"
import {JustifyContent} from "baseui/block";

const YES = "YES", NO = "NO", UNCLARIFIED = "UNCLARIFIED"
const boolToRadio = (bool?: boolean) => bool === undefined ? UNCLARIFIED : bool ? YES : NO
const radioToBool = (radio: string) => radio === UNCLARIFIED ? undefined : radio === YES

export const boolToText = (b?: boolean) => (b === null || b === undefined) ? intl.unclarified : b ? intl.yes : intl.no

type radioBoolProps = {
  value?: boolean,
  setValue: (b?: boolean) => void,
  omitUndefined?: boolean,
  firstButtonLabel?: string,
  secondButtonLabel?: string,
  justifyContent?: JustifyContent;
}

export const RadioBoolButton = (props: radioBoolProps) =>
  <RadioGroup value={boolToRadio(props.value)} align="horizontal"
              overrides={{RadioGroupRoot: {style: {width: "100%", justifyContent: props.justifyContent ? props.justifyContent : "stretch"}}}}
              onChange={
                (e) => {
                  props.setValue(radioToBool((e.target as HTMLInputElement).value))
                  console.log(e.target.value)
                }
              }
  >
    <Radio overrides={{Label: {style: {marginRight: "2rem"}}}} value={YES}>{intl.yes} {props.firstButtonLabel}</Radio>
    <Radio overrides={{Label: {style: {marginRight: "2rem"}}}} value={NO}>{intl.no} {props.secondButtonLabel}</Radio>
    {!props.omitUndefined && <Radio overrides={{Label: {style: {marginRight: "2rem"}}}} value={UNCLARIFIED}>{intl.unclarified}</Radio>}
  </RadioGroup>
