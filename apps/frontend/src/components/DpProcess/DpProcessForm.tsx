import React from "react";
import {DpProcessFormValues} from "../../constants";
import {Formik} from "formik";
import {dpProcessSchema} from "../common/schema";

type  DpProcessProps = {
  initialValues: DpProcessFormValues;
  handleSubmit: () => void;
}

const DpProcessForm = (props: DpProcessProps) => {
  const {initialValues, handleSubmit} = props

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={dpProcessSchema()}
      >

      </Formik>
    </>
  )
}

export default DpProcessForm
