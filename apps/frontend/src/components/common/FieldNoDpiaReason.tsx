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
          <Block width="100%">
            <Block width="100%">
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
            </Block>
            <Block>
              {renderTagList(
                props.formikBag.values.dpia.noDpiaReasons.map((p) => getNoDpiaLabel(p)),
                arrayHelpers,
              )}
            </Block>
          </Block>
        </>
      )}
    />
  )
}

export default FieldNoDpiaReason
