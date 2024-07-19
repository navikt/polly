import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LabelMedium } from 'baseui/typography'
import { ReactNode } from 'react'
import { theme } from '../../util'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

const TextWithLabel = (props: { label: string; text?: ReactNode; icon?: IconDefinition; iconColor?: string; error?: string; children?: ReactNode }) => {
  const errorIcon = <FontAwesomeIcon icon={faTimesCircle} color={theme.colors.negative500} />
  const value = props.text && (
    <div className="whitespace-pre-wrap block m-0 text-base">
      {props.error && errorIcon} {props.text}
    </div>
  )

  return (
    <>
      <LabelMedium marginBottom={theme.sizing.scale100}>
        {props.icon && <FontAwesomeIcon icon={props.icon} color={props.iconColor} />} {props.label}
      </LabelMedium>
      {!props.error && value}
      {props.error && <CustomizedStatefulTooltip content={props.error}>{value}</CustomizedStatefulTooltip>}
      {props.children}
    </>
  )
}

export default TextWithLabel
