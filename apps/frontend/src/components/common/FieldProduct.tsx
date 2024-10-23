import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { CodelistService, EListName, IGetParsedOptionsProps } from '../../service/Codelist'
import { renderTagList } from './TagList'

type TFieldProductsProps = {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
}

const FieldProduct = (props: TFieldProductsProps) => {
  const [codelistUtils] = CodelistService()

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
                options={codelistUtils
                  .getParsedOptions(EListName.SYSTEM)
                  .filter(
                    (option: IGetParsedOptionsProps) =>
                      !formikBag.values.affiliation.products.includes(option.id)
                  )}
                onChange={({ value }) => {
                  arrayHelpers.form.setFieldValue('affiliation.products', [
                    ...formikBag.values.affiliation.products,
                    ...value.map((v) => v.id),
                  ])
                }}
                overrides={{ Placeholder: { style: { color: 'black' } } }}
              />
            </div>
            <div>
              {renderTagList(
                formikBag.values.affiliation.products.map((product: string) =>
                  codelistUtils.getShortname(EListName.SYSTEM, product)
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

export default FieldProduct
