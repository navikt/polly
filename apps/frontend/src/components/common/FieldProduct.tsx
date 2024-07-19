import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../constants'
import { codelist, ListName } from '../../service/Codelist'
import { renderTagList } from './TagList'

type fieldProductsProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<DpProcessFormValues>
}

const FieldProduct = (props: fieldProductsProps) => {
  return (
    <FieldArray
      name="affiliation.products"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={codelist.getParsedOptions(ListName.SYSTEM).filter((o) => !props.formikBag.values.affiliation.products.includes(o.id))}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.products', [...props.formikBag.values.affiliation.products, ...value.map((v) => v.id)])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              {renderTagList(
                props.formikBag.values.affiliation.products.map((p) => codelist.getShortname(ListName.SYSTEM, p)),
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
