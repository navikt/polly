import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IProcessFormValues } from '../../../constants'
import { CodelistService, EListName, IGetParsedOptionsProps } from '../../../service/Codelist'

const FieldPurpose = (props: { formikBag: FormikProps<IProcessFormValues> }) => {
  const { formikBag } = props
  const [codelistUtils] = CodelistService()

  return (
    <FieldArray
      name="purposes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <Select
            value={codelistUtils.getParsedOptionsForList(
              EListName.PURPOSE,
              formikBag.values.purposes
            )}
            options={codelistUtils
              .getParsedOptions(EListName.PURPOSE)
              .filter(
                (option: IGetParsedOptionsProps) => !formikBag.values.purposes.includes(option.id)
              )}
            onChange={({ value }) => {
              arrayHelpers.form.setFieldValue(
                'purposes',
                value.map((value) => value.id)
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
