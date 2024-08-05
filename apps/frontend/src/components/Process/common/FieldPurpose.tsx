import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { codelist, ListName } from '../../../service/Codelist'

const FieldPurpose = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="purposes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <Select
            value={codelist.getParsedOptionsForList(ListName.PURPOSE, formikBag.values.purposes)}
            options={codelist.getParsedOptions(ListName.PURPOSE).filter((option) => !formikBag.values.purposes.includes(option.id))}
            onChange={({ value }) => {
              arrayHelpers.form.setFieldValue(
                'purposes',
                value.map((value) => value.id),
              )
            }}
            overrides={{ Placeholder: { style: { color: 'black' } } }}
          />
        </div>
      )}
    />
  )
}

export default FieldPurpose
