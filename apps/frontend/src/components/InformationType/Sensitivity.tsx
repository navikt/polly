import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserShield } from "@fortawesome/free-solid-svg-icons"
import * as React from "react"
import { Code, codelist, ListName } from "../../service/Codelist"
import { StatefulTooltip } from "baseui/tooltip"
import { SensitivityLevel } from "../../constants"
import { theme } from "../../util/theme"

export function sensitivityColor(code: string) {
  switch (code) {
    case SensitivityLevel.ART9:
      return theme.colors.negative500
    default:
      return theme.colors.primary
  }
}

export const Sensitivity = (props: { sensitivity: Code }) => {
  return (
    <StatefulTooltip content={() => `${codelist.getDescription(ListName.SENSITIVITY, props.sensitivity.code)}`}>
      <span><FontAwesomeIcon icon={faUserShield} color={sensitivityColor(props.sensitivity.code)} /></span>
    </StatefulTooltip>
  )
}
