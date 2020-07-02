import {Field, FieldProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {RadioBoolButton} from "../../common/Radio";
import * as React from "react";
import {JustifyContent} from "baseui/block";

const BoolField = (props: {
  value?: boolean,
  fieldName: string,
  omitUndefined?: boolean,
  firstButtonLabel?: string,
  secondButtonLabel?: string
  justifyContent ?: JustifyContent;
}) => (
  <Field
    name={props.fieldName}
    render={({form}: FieldProps<ProcessFormValues>) =>
      <RadioBoolButton
        value={props.value}
        setValue={(b) => form.setFieldValue(props.fieldName, b)}
        omitUndefined={props.omitUndefined}
        firstButtonLabel={props.firstButtonLabel}
        justifyContent={props.justifyContent}
      />
    }
  />
)

export default BoolField
