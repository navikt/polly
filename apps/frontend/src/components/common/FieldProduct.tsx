import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { EListName, ICodelistProps, IGetParsedOptionsProps } from '../../service/Codelist'
import { renderTagList } from './TagList'

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
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                label=""
                hideLabel
                onChange={(event) => {
                  if (event.target.value) {
                    arrayHelpers.form.setFieldValue('affiliation.products', [
                      ...formikBag.values.affiliation.products,
                      event.target.value,
                    ])
                  }
                }}
              >
                <option value="">Velg system</option>
                {codelistUtils
                  .getParsedOptions(EListName.SYSTEM)
                  .filter((option) => !formikBag.values.affiliation.products.includes(option.id))
                  .map((code) => (
                    <option key={code.id} value={code.id}>
                      {code.label}
                    </option>
                  ))}
              </Select>
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
