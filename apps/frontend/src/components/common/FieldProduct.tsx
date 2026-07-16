import { UNSAFE_Combobox as Combobox } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { EListName, ICodelistProps } from '../../service/Codelist'

type TFieldProductsProps = {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
  codelistUtils: ICodelistProps
}

const FieldProduct = (props: TFieldProductsProps) => {
  const { formikBag, codelistUtils } = props

  return (
    <FieldArray
      name="affiliation.products"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <Combobox
            label=""
            hideLabel
            isMultiSelect
            options={codelistUtils
              .getParsedOptions(EListName.SYSTEM)
              .map((code) => ({ label: code.label, value: code.id }))}
            selectedOptions={formikBag.values.affiliation.products.map((product: string) => ({
              label: codelistUtils.getShortname(EListName.SYSTEM, product),
              value: product,
            }))}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                arrayHelpers.form.setFieldValue('affiliation.products', [
                  ...formikBag.values.affiliation.products,
                  option,
                ])
              } else {
                arrayHelpers.form.setFieldValue(
                  'affiliation.products',
                  formikBag.values.affiliation.products.filter(
                    (product: string) => product !== option
                  )
                )
              }
            }}
          />
        </div>
      )}
    />
  )
}

export default FieldProduct
