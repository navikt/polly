import React from 'react'
import {Block, BlockProps} from "baseui/block";
import {Error, ModalLabel} from "../../common/ModalSchema";
import {intl} from "../../../util";
import BoolField from "../../Process/common/BoolField";
import FieldDpProcessSubDataProcessorAgreements from "./FieldDpProcessSubDataProcessorAgreements";
import FieldDpProcessSubDataProcessorTransferGroundsOutsideEU from "./FieldDpProcessSubDataProcessorTransferGroundsOutsideEU";
import {DpProcessFormValues, TRANSFER_GROUNDS_OUTSIDE_EU_OTHER} from "../../../constants";
import FieldDpProcessSubDataProcessorTransferGroundsOutsideEUOther from "./FieldDpProcessSubDataProcessorTransferGroundsOutsideEUOther";
import FieldDpProcessSubDataProcessorTransferCountries from "./FieldDpProcessSubDataProcessorTransferCountries";
import {FormikProps} from "formik";

type FieldDpProcessSubDataProcessorProps = {
  rowBlockProps: BlockProps
  formikBag: FormikProps<DpProcessFormValues>
}

const FieldDpProcessSubDataProcessor = (props: FieldDpProcessSubDataProcessorProps) => {
  const {rowBlockProps, formikBag} = props
  return (
    <>
      <Block {...rowBlockProps} marginTop={0}>
        <ModalLabel label={intl.isDataProcessorUsed} tooltip={intl.dataProcessorHelpText}/>
        <BoolField fieldName='subDataProcessing.dataProcessor'
                   value={formikBag.values.subDataProcessing.dataProcessor}/>
      </Block>

      {formikBag.values.subDataProcessing.dataProcessor && <>
        <Block {...rowBlockProps}>
          <ModalLabel label={intl.dataProcessorAgreement}/>
          <FieldDpProcessSubDataProcessorAgreements formikBag={formikBag}/>
        </Block>
        <Error fieldName='subDataProcessing.dataProcessorAgreement'/>

        <Block {...rowBlockProps}>
          <ModalLabel label={intl.isDataProcessedOutsideEUEEA}/>
          <BoolField fieldName='subDataProcessing.dataProcessorOutsideEU'
                     value={formikBag.values.subDataProcessing.dataProcessorOutsideEU}/>
        </Block>
        {formikBag.values.subDataProcessing.dataProcessorOutsideEU &&
        <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.transferGroundsOutsideEUEEA}/>
            <FieldDpProcessSubDataProcessorTransferGroundsOutsideEU
              code={formikBag.values.subDataProcessing.transferGroundsOutsideEU}/>
          </Block>
          <Error fieldName='subDataProcessing.transferGroundsOutsideEU'/>

          {formikBag.values.subDataProcessing.transferGroundsOutsideEU === TRANSFER_GROUNDS_OUTSIDE_EU_OTHER &&
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.transferGroundsOutsideEUEEAOther}/>
            <FieldDpProcessSubDataProcessorTransferGroundsOutsideEUOther/>
          </Block>}
          <Error fieldName='subDataProcessing.transferGroundsOutsideEUOther'/>

          <Block {...rowBlockProps}>
            <ModalLabel label={intl.countries}/>
            <FieldDpProcessSubDataProcessorTransferCountries formikBag={formikBag}/>
          </Block>
          <Error fieldName='subDataProcessing.transferCountries'/>
        </>}
      </>}
    </>
  )
}

export default FieldDpProcessSubDataProcessor
