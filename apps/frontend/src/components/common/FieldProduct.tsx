import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../constants'
import { codelist, ListName } from '../../service/Codelist'
import { renderTagList } from './TagList'

type fieldProductsProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<DpProcessFormValues>
}

const FieldProduct = (props: fieldProductsProps) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="affiliation.products"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={codelist.getParsedOptions(ListName.SYSTEM).filter((option) => !formikBag.values.affiliation.products.includes(option.id))}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.products', [...formikBag.values.affiliation.products, ...value.map((v) => v.id)])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              {renderTagList(
                formikBag.values.affiliation.products.map((product: string) => codelist.getShortname(ListName.SYSTEM, product)),
                arrayHelpers,
              )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldProduct
