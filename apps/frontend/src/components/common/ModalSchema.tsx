import { ErrorMessage } from 'formik'
import { Block } from 'baseui/block'
import { KIND as NKIND, Notification } from 'baseui/notification'
import { LabelMedium } from 'baseui/typography'
import * as React from 'react'
import { theme } from '../../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { paddingZero } from './Style'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

export const Error = (props: { fieldName: string; fullWidth?: boolean }) => (
  <ErrorMessage name={props.fieldName}>
    {(msg: any) => (
      <div className="flex w-full mt-1">
        {!props.fullWidth && <ModalLabel />}
        <div className="w-full">
          <Notification overrides={{ Body: { style: { width: 'auto', ...paddingZero, marginTop: 0 } } }} kind={NKIND.negative}>
            {msg}
          </Notification>
        </div>
      </div>
    )}
  </ErrorMessage>
)

export const ModalLabel = (props: { label?: any; tooltip?: string | React.ReactElement; fullwidth?: boolean }) => {
  return (
    <div className={`self-center pr-4 ${props.fullwidth ? 'w-full' : 'min-w-[25%] max-w-[25%]' }`}>
      {props.tooltip ? (
        <CustomizedStatefulTooltip content={props.tooltip}>
          <LabelMedium font="font300" display="flex" width="100%" justifyContent="flex-start">
            <div className="flex">
              <div>{props.label}</div>
              <div className="self-center">
                <FontAwesomeIcon style={{ marginLeft: '.5rem', alignSelf: 'center' }} icon={faQuestionCircle} color={theme.colors.primary300} size="sm" />
              </div>
            </div>
          </LabelMedium>
        </CustomizedStatefulTooltip>
      ) : (
        <LabelMedium font="font300">{props.label}</LabelMedium>
      )}
    </div>
  )
}
