import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { KIND as NKIND, Notification } from 'baseui/notification'
import { LabelMedium } from 'baseui/typography'
import { ErrorMessage } from 'formik'
import { ReactElement } from 'react'
import { theme } from '../../util'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'
import { paddingZero } from './Style'

interface IErrorProps {
  fieldName: string
  fullWidth?: boolean
}

export const Error = (props: IErrorProps) => {
  const { fieldName, fullWidth } = props

  return (
    <ErrorMessage name={fieldName}>
      {(msg: any) => (
        <div className="flex w-full mt-1">
          {!fullWidth && <ModalLabel />}
          <div className="w-full">
            <Notification
              overrides={{ Body: { style: { width: 'auto', ...paddingZero, marginTop: 0 } } }}
              kind={NKIND.negative}
            >
              {msg}
            </Notification>
          </div>
        </div>
      )}
    </ErrorMessage>
  )
}

interface IModalLabelProps {
  label?: any
  tooltip?: string | ReactElement
  fullwidth?: boolean
}

export const ModalLabel = (props: IModalLabelProps) => {
  const { label, tooltip, fullwidth } = props

  return (
    <div className={`self-center pr-4 ${fullwidth ? 'w-full' : 'min-w-[25%] max-w-[25%]'}`}>
      {!tooltip && <LabelMedium font="font300">{label}</LabelMedium>}
      {tooltip && (
        <CustomizedStatefulTooltip content={tooltip}>
          <LabelMedium font="font300" display="flex" width="100%" justifyContent="flex-start">
            <div className="flex">
              <div>{label}</div>
              <div className="self-center">
                <FontAwesomeIcon
                  style={{ marginLeft: '.5rem', alignSelf: 'center' }}
                  icon={faQuestionCircle}
                  color={theme.colors.primary300}
                  size="sm"
                />
              </div>
            </div>
          </LabelMedium>
        </CustomizedStatefulTooltip>
      )}
    </div>
  )
}
