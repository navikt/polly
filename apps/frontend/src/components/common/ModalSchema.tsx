import { Detail, Label } from '@navikt/ds-react'
import { ErrorMessage } from 'formik'
import CustomizedStatefulTooltip from './CustomizedStatefulTooltip'

interface IErrorProps {
  fieldName: string
  fullWidth?: boolean
  messageClassName?: string
}

export const Error = (props: IErrorProps) => {
  const { fieldName, fullWidth, messageClassName } = props

  return (
    <ErrorMessage name={fieldName}>
      {(msg: any) => (
        <div className="flex w-full mt-1">
          {!fullWidth && <ModalLabel />}
          <div className="w-full">
            <p className={`navds-error-message navds-label ${messageClassName ?? ''}`}>{msg}</p>
          </div>
        </div>
      )}
    </ErrorMessage>
  )
}

interface IModalLabelProps {
  label?: any
  description?: any
  tooltip?: string
  fullwidth?: boolean
}

export const ModalLabel = (props: IModalLabelProps) => {
  const { label, tooltip, fullwidth, description } = props

  return (
    <div className={`self-center pr-4 ${fullwidth ? 'w-full' : 'min-w-[30%] max-w-[30%]'}`}>
      {!tooltip && (
        <div>
          <Label size="small">{label}</Label>
          <Detail>{description}</Detail>
        </div>
      )}
      {tooltip && (
        <div className="w-full">
          <div className="flex items-center w-full">
            <Label size="small">{label}</Label>
            <CustomizedStatefulTooltip content={tooltip} />
          </div>
          <Detail>{description}</Detail>
        </div>
      )}
    </div>
  )
}

interface IPropsError {
  fieldName: string
  akselStyling?: boolean
}

export const FormError = ({ fieldName, akselStyling }: IPropsError) => (
  <>
    {!akselStyling && <ErrorMessage name={fieldName}>{(msg: string) => msg}</ErrorMessage>}

    {akselStyling && (
      <div
        className="navds-form-field__error pt-2"
        id="textField-error-rm"
        aria-relevant="additions removals"
        aria-live="polite"
      >
        <ErrorMessage name={fieldName}>
          {(msg: string) => (
            <p className="navds-error-message navds-label flex gap-2">
              <span>•</span>
              {msg}
            </p>
          )}
        </ErrorMessage>
      </div>
    )}
  </>
)
