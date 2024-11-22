import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ENoDpiaReason, IProcessFormValues } from '../../constants'
import { getNoDpiaLabel } from '../../util/helper-functions'
import { renderTagList } from './TagList'

type TFieldNoDpiaReasonProps = {
  formikBag: FormikProps<IProcessFormValues>
}

const FieldNoDpiaReason = (props: TFieldNoDpiaReasonProps) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="dpia.noDpiaReasons"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                label="Velg begrunnelse"
                hideLabel
                onChange={(event) => {
                  if (event.target.value) {
                    arrayHelpers.form.setFieldValue('dpia.noDpiaReasons', [
                      ...formikBag.values.dpia.noDpiaReasons,
                      event.target.value,
                    ])
                  }
                }}
              >
                <option value="">Velg begrunnelse</option>
                {Object.keys(ENoDpiaReason)
                  .filter(
                    (reason: string) => formikBag.values.dpia.noDpiaReasons.indexOf(reason) === -1
                  )
                  .map((reason: string) => (
                    <option value={reason} key={reason}>
                      {' '}
                      {getNoDpiaLabel(reason)}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              {renderTagList(
                formikBag.values.dpia.noDpiaReasons.map((reason: string) => getNoDpiaLabel(reason)),
                arrayHelpers
              )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldNoDpiaReason
