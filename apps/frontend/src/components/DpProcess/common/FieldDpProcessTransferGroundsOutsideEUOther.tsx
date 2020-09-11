import * as React from "react";
import {Field, FieldProps} from "formik";
import {DpProcessFormValues} from "../../../constants";
import {Input, SIZE} from 'baseui/input'

const FieldDpProcessTransferGroundsOutsideEUOther = () => {

  return (
    <Field
      name='subDataProcessing.transferGroundsOutsideEUOther'
      render={({field, form}: FieldProps<string, DpProcessFormValues>) => (
        <Input {...field} type='input' size={SIZE.default}
               error={!!form.errors.subDataProcessing?.transferGroundsOutsideEUOther && form.touched.subDataProcessing?.transferGroundsOutsideEUOther}/>
      )}
    />
  )
}

export default FieldDpProcessTransferGroundsOutsideEUOther
