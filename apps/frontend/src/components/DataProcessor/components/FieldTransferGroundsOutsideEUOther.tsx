import * as React from "react";
import {Field, FieldProps} from "formik";
import {DataProcessorFormValues} from "../../../constants";
import {Input, SIZE} from 'baseui/input'

const FieldTransferGroundsOutsideEUOther = () => {

  return (
    <Field
      name='transferGroundsOutsideEUOther'
      render={({field, form}: FieldProps<string, DataProcessorFormValues>) => (
        <Input {...field} type='input' size={SIZE.default}
               error={!!form.errors.transferGroundsOutsideEUOther && form.touched.transferGroundsOutsideEUOther}/>
      )}
    />
  )
}

export default FieldTransferGroundsOutsideEUOther
