import { faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CodelistService, EListName, ESensitivityLevel, ICode } from '../../service/Codelist'
import { theme } from '../../util/theme'
import CustomizedStatefulTooltip from '../common/CustomizedStatefulTooltip'

export function sensitivityColor(code: string) {
  switch (code) {
    case ESensitivityLevel.ART9:
      return theme.colors.negative500
    default:
      return theme.colors.mono1000
  }
}

export const Sensitivity = (props: { sensitivity: ICode }) => {
  const [codelistUtils] = CodelistService()

  return (
    <CustomizedStatefulTooltip
      content={`${codelistUtils.getDescription(EListName.SENSITIVITY, props.sensitivity.code)}`}
      icon={
        <FontAwesomeIcon icon={faUserShield} color={sensitivityColor(props.sensitivity.code)} />
      }
    />
  )
}
