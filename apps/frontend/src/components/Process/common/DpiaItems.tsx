import { FormikProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { default as React } from 'react'
import { Block, BlockProps } from 'baseui/block'
import { ModalLabel } from '../../common/ModalSchema'
import FieldInput from './FieldInput'
import BoolField from './BoolField'
import { intl } from '../../../util'
import FieldNoDpiaReason from '../../common/FieldNoDpiaReason'

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const DpiaItems = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const { formikBag } = props
  return (
    <>
      <Block {...rowBlockProps} marginTop={0}>
        <ModalLabel label={intl.isDpiaRequired} tooltip={intl.dpiaHelpText} />
        <BoolField fieldName="dpia.needForDpia" value={formikBag.values.dpia.needForDpia} omitUndefined={false} />
      </Block>
      {formikBag.values.dpia?.needForDpia === undefined ? (
        <></>
      ) : formikBag.values.dpia?.needForDpia ? (
        <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.dpiaReference} />
            <FieldInput fieldName="dpia.refToDpia" fieldValue={formikBag.values.dpia?.refToDpia} placeHolder={intl.dpiaReferencePlaceholder} />
          </Block>
        </>
      ) : (
        <>
          <Block {...rowBlockProps}>
            <ModalLabel label={intl.grounds} />
            <FieldNoDpiaReason formikBag={formikBag} />
          </Block>

          {formikBag.values.dpia.noDpiaReasons.filter((reason) => reason === 'OTHER').length > 0 && (
            <Block {...rowBlockProps}>
              <ModalLabel label={intl.specifyOther} />
              <FieldInput fieldName="dpia.grounds" fieldValue={formikBag.values.dpia?.grounds} />
            </Block>
          )}
        </>
      )}
    </>
  )
}

export default DpiaItems
