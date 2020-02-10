import { intl } from "../../util"
import { Radio, RadioGroup } from "baseui/radio"
import * as React from "react"

const YES = "YES", NO = "NO", UNCLARIFIED = "UNCLARIFIED"
const boolToRadio = (bool?: boolean) => bool === undefined ? UNCLARIFIED : bool ? YES : NO
const radioToBool = (radio: string) => radio === UNCLARIFIED ? undefined : radio === YES

export const boolToText = (b?: boolean) => (b === null || b === undefined) ? intl.unclarified : b ? intl.yes : intl.no

export const RadioBoolButton = (props: { value?: boolean, setValue: (b?: boolean) => void, omitUndefined?: boolean }) =>
  <RadioGroup value={boolToRadio(props.value)} align="horizontal"
              overrides={{RadioGroupRoot: {style: {width: "100%"}}}}
              onChange={(e) => props.setValue(radioToBool((e.target as HTMLInputElement).value))}
  >
    <Radio overrides={{Label: {style: {marginRight: "2rem"}}}} value={YES}>{intl.yes}</Radio>
    <Radio overrides={{Label: {style: {marginRight: "2rem"}}}} value={NO}>{intl.no}</Radio>
    {!props.omitUndefined && <Radio overrides={{Label: {style: {marginRight: "2rem"}}}} value={UNCLARIFIED}>{intl.unclarified}</Radio>}
  </RadioGroup>
