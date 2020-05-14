import * as React from "react"
import {Select} from "baseui/select"
import {codelist, ListName} from "../../../service/Codelist"
import {FieldArray, FormikProps} from "formik"
import {ProcessFormValues} from "../../../constants"
import {renderTagList} from "../../common/TagList"
import {Block} from "baseui/block"

const FieldProduct = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  return <FieldArray
    name='products'
    render={arrayHelpers => (
      <>
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              options={codelist.getParsedOptions(ListName.SYSTEM).filter(o => !props.formikBag.values.products.includes(o.id))}
              onChange={({value}) => {
                arrayHelpers.form.setFieldValue('products', [...props.formikBag.values.products, ...value.map(v => v.id)])
              }}
            />
          </Block>
          <Block>{renderTagList(props.formikBag.values.products, arrayHelpers)}</Block>
        </Block>
      </>
    )}
  />
}

export default FieldProduct
