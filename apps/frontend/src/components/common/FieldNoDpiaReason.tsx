import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { NoDpiaReason, ProcessFormValues } from '../../constants'
import { getNoDpiaLabel } from '../../util/helper-functions'
import { renderTagList } from './TagList'

type fieldNoDpiaReasonProps = {
  formikBag: FormikProps<ProcessFormValues>
}

const FieldNoDpiaReason = (props: fieldNoDpiaReasonProps) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="dpia.noDpiaReasons"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                placeholder="Velg en eller flere begrunnelser"
                options={Object.keys(NoDpiaReason)
                  .filter((reason: string) => formikBag.values.dpia.noDpiaReasons.indexOf(reason) === -1)
                  .map((reason: string) => {
                    return {
                      label: getNoDpiaLabel(reason),
                      id: reason,
                    }
                  })}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('dpia.noDpiaReasons', [...formikBag.values.dpia.noDpiaReasons, ...value.map((value) => value.id)])
                }}
              />
            </div>
            <div>
              {renderTagList(
                formikBag.values.dpia.noDpiaReasons.map((reason: string) => getNoDpiaLabel(reason)),
                arrayHelpers,
              )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldNoDpiaReason
