import {Field, FieldProps} from "formik";
import {ProcessorFormValues} from "../../../constants";
import {Textarea} from "baseui/textarea";
import {SIZE as InputSIZE} from "baseui/input";
import * as React from "react";

const FieldNote = () => (
  <Field
    name='note'
    render={({field, form}: FieldProps<string, ProcessorFormValues>) => (
      <Textarea {...field} type='input' size={InputSIZE.default}
                error={!!form.errors.note && form.touched.note}/>
    )}
  />
)

export default FieldNote
