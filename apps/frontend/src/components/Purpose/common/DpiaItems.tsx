import {FormikProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {default as React} from "react";
import {Block, BlockProps} from "baseui/block";
import {ModalLabel} from "../../common/ModalSchema";
import FieldInput from "./FieldInput";
import BoolField from "./BoolField";
import {intl} from "../../../util";

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const DpiaItems = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const {formikBag} = props

  return (
    <>
      <Block {...rowBlockProps} marginTop={0}>
        <ModalLabel label={intl.isDpiaRequired}/>
        <BoolField fieldName='dpia.needForDpia' value={formikBag.values.dpia?.needForDpia}/>
      </Block>

      {formikBag.values.dpia?.needForDpia ? <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.dpiaReference}/>
            <FieldInput fieldName='dpia.refToDpia'
                        fieldValue={formikBag.values.dpia?.refToDpia}/>
          </Block>
        </> :
        <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.grounds}/>
            <FieldInput fieldName='dpia.grounds'
                        fieldValue={formikBag.values.dpia?.grounds}/>
          </Block>
        </>}
    </>
  )
}

export default DpiaItems
