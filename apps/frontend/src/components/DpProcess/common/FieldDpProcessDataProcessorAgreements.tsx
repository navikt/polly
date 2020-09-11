import {FieldArray, FieldArrayRenderProps, FormikProps} from "formik";
import {DpProcessFormValues} from "../../../constants";
import * as React from "react";
import {Block} from "baseui/block";
import {Input} from "baseui/input";
import {intl} from "../../../util";
import {Button, SHAPE} from "baseui/button";
import {Plus} from "baseui/icon";
import {renderTagList} from "../../common/TagList";

const FieldDpProcessDataProcessorAgreements = (props: { formikBag: FormikProps<DpProcessFormValues> }) => {
  const [currentKeywordValue, setCurrentKeywordValue] = React.useState('')
  const agreementRef = React.useRef<HTMLInputElement>(null)

  const onAddAgreement = (arrayHelpers: FieldArrayRenderProps) => {
    if (!currentKeywordValue) return
    arrayHelpers.push(currentKeywordValue)
    setCurrentKeywordValue('')
    if (agreementRef && agreementRef.current) {
      agreementRef.current.focus()
    }
  }

  return (
    <FieldArray
      name='subDataProcessing.dataProcessorAgreements'
      render={arrayHelpers => (
        <Block width='100%'>
          <Input
            type='text'
            size='compact'
            placeholder={intl.dataProcessorAgreementPlaceholder}
            value={currentKeywordValue}
            onChange={event => setCurrentKeywordValue(event.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddAgreement(arrayHelpers)
            }}
            onBlur={() => onAddAgreement(arrayHelpers)}
            inputRef={agreementRef}
            overrides={{
              After: () => (
                <Button
                  type='button'
                  size='compact'
                  shape={SHAPE.square}
                >
                  <Plus/>
                </Button>
              )
            }}
          />
          {renderTagList(props.formikBag.values.subDataProcessing.dataProcessorAgreements, arrayHelpers)}
        </Block>
      )}
    />
  )
}

export default FieldDpProcessDataProcessorAgreements
