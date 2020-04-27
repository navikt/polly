import { Field, FieldProps } from "formik";
import { Input } from "baseui/input";
import * as React from "react";

const FieldInput = (props: { fieldName: string, fieldValue?: string | number }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<string>) => (
        <Input {...field} size='compact'/>
      )}
    />
  )
}

export default FieldInput
