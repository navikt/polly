import {Field, FieldProps, FormikProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {default as React, useEffect, useState} from "react";
import {Block, BlockProps} from "baseui/block";
import {Error, ModalLabel} from "../../common/ModalSchema";
import {intl, theme} from "../../../util";
import {Slider} from "baseui/slider";
import FieldInput from "./FieldInput";
import BoolField from "./BoolField";

function sliderOverride(suffix: string) {
  return {
    ThumbValue: {
      component: (prop: any) => <div style={{
        position: 'absolute',
        top: `-${theme.sizing.scale800}`,
        ...theme.typography.font200,
        backgroundColor: 'transparent',
        whiteSpace: 'nowrap',
      }}>{prop.children} {suffix}</div>
    }
  }
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const RetentionItems = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const {formikBag} = props

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears = Math.floor(retention / 12)
  const retentionMonths = retention - retentionYears * 12

  useEffect(() => {
    (() => formikBag.setFieldValue('retention.retentionMonths', retention))()
  }, [retention])

  return (
    <>
      <Block {...rowBlockProps} marginTop={0}>
        <ModalLabel label={intl.includeConservationPlan} tooltip={intl.retentionHelpText}/>
        <BoolField fieldName='retention.retentionPlan' value={formikBag.values.retention.retentionPlan}/>
      </Block>

      {<>
        <Block {...rowBlockProps}>
          <ModalLabel label={intl.retentionMonths}/>
          <Field
            name='retention.retentionMonths'
            render={({field, form}: FieldProps<string, ProcessFormValues>) => (
              <>
                <Slider
                  overrides={sliderOverride(intl.years)}
                  min={0} max={100}
                  value={[retentionYears]}
                  onChange={({value}) => setRetention(value[0] * 12 + retentionMonths)}
                />
                <Slider
                  overrides={sliderOverride(intl.months)}
                  min={0} max={11}
                  value={[retentionMonths]}
                  onChange={({value}) => setRetention(value[0] + retentionYears * 12)}
                />
              </>
            )}/>
        </Block>
        <Error fieldName='retention.retentionMonths'/>

        <Block {...rowBlockProps}>
          <ModalLabel label={intl.retentionStart}/>
          <Block width={"100%"}>
            <FieldInput fieldName='retention.retentionStart'
                        fieldValue={formikBag.values.retention.retentionStart}/>
          </Block>
        </Block>
        <Error fieldName='retention.retentionStart'/>
      </>}
      <Block {...rowBlockProps}>
        <ModalLabel label={intl.retentionDescription}/>
        <FieldInput
          fieldName='retention.retentionDescription'
          fieldValue={formikBag.values.retention.retentionDescription}
          placeHolder={intl.retentionDescriptionPlaceHolder}
        />
      </Block>
      < Error fieldName='retention.retentionDescription'/>
    </>
  )
}

export default RetentionItems
