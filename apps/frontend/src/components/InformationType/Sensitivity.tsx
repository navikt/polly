import { ShieldIcon } from '@navikt/aksel-icons'
import { EListName, ESensitivityLevel, ICode, ICodelistProps } from '../../service/Codelist'
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

export const Sensitivity = (props: { sensitivity: ICode; codelistUtils: ICodelistProps }) => {
  return (
    <CustomizedStatefulTooltip
      content={`${props.codelistUtils.getDescription(EListName.SENSITIVITY, props.sensitivity.code)}`}
      icon={
        <ShieldIcon
          aria-hidden
          className="block"
          style={{ color: sensitivityColor(props.sensitivity.code) }}
        />
      }
    />
  )
}
