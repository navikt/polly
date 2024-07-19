import * as React from 'react'
import { Select } from 'baseui/select'
import { codelist, ListName } from '../../service/Codelist'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../constants'
import { Block } from 'baseui/block'
import { renderTagList } from './TagList'

const FieldSubDepartments = (props: { formikBag: FormikProps<ProcessFormValues> | FormikProps<DpProcessFormValues> }) => {
  return (
    <FieldArray
      name="affiliation.subDepartments"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              clearable
              options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT).filter((o) => !props.formikBag.values.affiliation.subDepartments.includes(o.id))}
              onChange={({ value }) => {
                arrayHelpers.form.setFieldValue('affiliation.subDepartments', [...props.formikBag.values.affiliation.subDepartments, ...value.map((v) => v.id)])
              }}
              overrides={{ Placeholder: { style: { color: 'black' } } }}
            />
          </div>
          <div>
            <div>
              {renderTagList(
                props.formikBag.values.affiliation.subDepartments.map((p) => codelist.getShortname(ListName.SUB_DEPARTMENT, p)),
                arrayHelpers,
              )}
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default FieldSubDepartments
