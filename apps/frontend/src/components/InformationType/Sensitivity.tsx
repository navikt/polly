import { faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EListName, ESensitivityLevel, ICode, codelist } from '../../service/Codelist'
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

export const Sensitivity = (props: { sensitivity: ICode }) => (
  <CustomizedStatefulTooltip
    content={() => `${codelist.getDescription(EListName.SENSITIVITY, props.sensitivity.code)}`}
  >
    <span>
      <FontAwesomeIcon icon={faUserShield} color={sensitivityColor(props.sensitivity.code)} />
    </span>
  </CustomizedStatefulTooltip>
)
