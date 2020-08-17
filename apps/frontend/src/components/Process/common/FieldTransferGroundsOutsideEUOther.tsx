import * as React from "react";
import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Input, SIZE} from 'baseui/input/index'

const FieldTransferGroundsOutsideEUOther = () => {

  return (
    <Field
      name='dataProcessing.transferGroundsOutsideEUOther'
      render={({field, form}: FieldProps<string, ProcessFormValues>) => (
        <Input {...field} type='input' size={SIZE.default}
               error={!!form.errors.dataProcessing?.transferGroundsOutsideEUOther && form.touched.dataProcessing?.transferGroundsOutsideEUOther}/>
      )}
    />
  )
}

export default FieldTransferGroundsOutsideEUOther
