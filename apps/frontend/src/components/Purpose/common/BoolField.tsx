import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {RadioBoolButton} from "../../common/Radio";
import * as React from "react";

const BoolField = (props: {
  value?: boolean,
  fieldName: string,
  omitUndefined?: boolean,
  firstButtonLabel?: string,
  secondButtonLabel?: string
}) => (
  <Field
    name={props.fieldName}
    render={({form}: FieldProps<ProcessFormValues>) =>
      <RadioBoolButton
        value={props.value}
        setValue={(b) => form.setFieldValue(props.fieldName, b)}
        omitUndefined={props.omitUndefined}
        firstButtonLabel={props.firstButtonLabel}
      />
    }
  />
)

export default BoolField
