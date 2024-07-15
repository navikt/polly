import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../constants'
import { codelist, ListName } from '../../service/Codelist'
import { renderTagList } from './TagList'

type fieldDispatcherProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<DpProcessFormValues>
}

const FieldDispatcher = (props: fieldDispatcherProps) => {
  return (
    <FieldArray
      name="affiliation.disclosureDispatchers"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={codelist.getParsedOptions(ListName.SYSTEM).filter((o) => !props.formikBag.values.affiliation.disclosureDispatchers.includes(o.id))}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.disclosureDispatchers', [...props.formikBag.values.affiliation.disclosureDispatchers, ...value.map((v) => v.id)])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              {renderTagList(
                props.formikBag.values.affiliation.disclosureDispatchers.map((p) => codelist.getShortname(ListName.SYSTEM, p)),
                arrayHelpers,
              )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldDispatcher
