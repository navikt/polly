import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { EListName, ICodelistProps } from '../../service/Codelist'
import { renderTagList } from './TagList'

type TFieldDispatcherProps = {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
  codelistUtils: ICodelistProps
}

const FieldDispatcher = (props: TFieldDispatcherProps) => {
  const { formikBag, codelistUtils } = props

  return (
    <FieldArray
      name="affiliation.disclosureDispatchers"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={codelistUtils
                  .getParsedOptions(EListName.SYSTEM)
                  .filter(
                    (option) =>
                      !formikBag.values.affiliation.disclosureDispatchers.includes(option.id)
                  )}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.disclosureDispatchers', [
                    ...formikBag.values.affiliation.disclosureDispatchers,
                    ...value.map((value) => value.id),
                  ])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              {renderTagList(
                formikBag.values.affiliation.disclosureDispatchers.map((disclosureDispatcher) =>
                  codelistUtils.getShortname(EListName.SYSTEM, disclosureDispatcher)
                ),
                arrayHelpers
              )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldDispatcher
