import * as React from 'react'
import { Select } from 'baseui/select'
import { codelist, ListName } from '../../service/Codelist'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../constants'
import { renderTagList } from './TagList'
import { Block } from 'baseui/block'

type fieldDispatcherProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<DpProcessFormValues>
}

const FieldDispatcher = (props: fieldDispatcherProps) => {
  return (
    <FieldArray
      name="affiliation.disclosureDispatchers"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <Block width="100%">
            <Block width="100%">
              <Select
                clearable
                options={codelist.getParsedOptions(ListName.SYSTEM).filter((o) => !props.formikBag.values.affiliation.disclosureDispatchers.includes(o.id))}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.disclosureDispatchers', [...props.formikBag.values.affiliation.disclosureDispatchers, ...value.map((v) => v.id)])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </Block>
            <Block>
              {renderTagList(
                props.formikBag.values.affiliation.disclosureDispatchers.map((p) => codelist.getShortname(ListName.SYSTEM, p)),
                arrayHelpers,
              )}
            </Block>
          </Block>
        </>
      )}
    />
  )
}

export default FieldDispatcher
