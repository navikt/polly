import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserShield } from '@fortawesome/free-solid-svg-icons'
import * as React from 'react'
import { Code, codelist, ListName, SensitivityLevel } from '../../service/Codelist'
import { theme } from '../../util/theme'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'

export function sensitivityColor(code: string) {
  switch (code) {
    case SensitivityLevel.ART9:
      return theme.colors.negative500
    default:
      return theme.colors.mono1000
  }
}

export const Sensitivity = (props: { sensitivity: Code }) => {
  return (
    <CustomizedStatefulTooltip content={() => `${codelist.getDescription(ListName.SENSITIVITY, props.sensitivity.code)}`}>
      <span>
        <FontAwesomeIcon icon={faUserShield} color={sensitivityColor(props.sensitivity.code)} />
      </span>
    </CustomizedStatefulTooltip>
  )
}
