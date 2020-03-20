import {Field, FieldProps} from "formik";
import {DisclosureFormValues} from "../../../constants";
import {Input} from "baseui/input";
import * as React from "react";

const FieldInput = (props: { fieldName: string, fieldValue?: string | number }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<string, DisclosureFormValues>) => (
        <Input {...field} size='compact'/>
      )}
    />
  )
}

export default FieldInput
