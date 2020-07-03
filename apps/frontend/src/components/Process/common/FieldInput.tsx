import {Field, FieldProps} from "formik";
import {Input} from "baseui/input";
import * as React from "react";

const FieldInput = (props: { fieldName: string, fieldValue?: string | number, placeHolder?: string }) => {
  return (
    <Field
      name={props.fieldName}
      render={({field, form}: FieldProps<string>) => (
        <Input {...field} size='compact' placeholder={!!props.placeHolder ? props.placeHolder : ''}/>
      )}
    />
  )
}

export default FieldInput
