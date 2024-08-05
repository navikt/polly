import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../constants'
import { codelist, ListName } from '../../service/Codelist'
import { renderTagList } from './TagList'

type fieldDispatcherProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<DpProcessFormValues>
}

const FieldDispatcher = (props: fieldDispatcherProps) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="affiliation.disclosureDispatchers"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={codelist.getParsedOptions(ListName.SYSTEM).filter((option) => !formikBag.values.affiliation.disclosureDispatchers.includes(option.id))}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.disclosureDispatchers', [...formikBag.values.affiliation.disclosureDispatchers, ...value.map((value) => value.id)])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              {renderTagList(
                formikBag.values.affiliation.disclosureDispatchers.map((disclosureDispatcher) => codelist.getShortname(ListName.SYSTEM, disclosureDispatcher)),
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
