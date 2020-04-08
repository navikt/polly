import * as React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {FieldArray} from "formik";

const FieldProduct = (props: { products: string[] }) => {
  const {products} = props
  const [value, setValue] = React.useState<Value>(products ? products.map(product => ({
    id: product,
    label: codelist.getShortname(ListName.SYSTEM, product)
  })) : [])

  return <FieldArray
    name='products'
    render={arrayHelpers => <Select
      multi
      clearable
      options={codelist.getParsedOptions(ListName.SYSTEM)}
      onChange={({value}) => {
        setValue(value)
        arrayHelpers.form.setFieldValue('products', value.map(v => v.id))
      }}
      value={value}
    />}
  />
}

export default FieldProduct
