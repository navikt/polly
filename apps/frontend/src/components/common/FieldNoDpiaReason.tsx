import * as React from 'react'
import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { NoDpiaReason, ProcessFormValues } from '../../constants'
import { renderTagList } from './TagList'
import { Block } from 'baseui/block'
import { getNoDpiaLabel } from '../../util/helper-functions'

type fieldNoDpiaReasonProps = {
  formikBag: FormikProps<ProcessFormValues>
}

const FieldNoDpiaReason = (props: fieldNoDpiaReasonProps) => {
  return (
    <FieldArray
      name="dpia.noDpiaReasons"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                placeholder='Velg en eller flere begrunnelser'
                options={Object.keys(NoDpiaReason)
                  .filter((reason) => props.formikBag.values.dpia.noDpiaReasons.indexOf(reason) === -1)
                  .map((reason) => {
                    return {
                      label: getNoDpiaLabel(reason),
                      id: reason,
                    }
                  })}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('dpia.noDpiaReasons', [...props.formikBag.values.dpia.noDpiaReasons, ...value.map((v) => v.id)])
                }}
              />
            </div>
            <div>
              {renderTagList(
                props.formikBag.values.dpia.noDpiaReasons.map((p) => getNoDpiaLabel(p)),
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
