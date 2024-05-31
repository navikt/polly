import { FormikProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { default as React } from 'react'
import { Block, BlockProps } from 'baseui/block'
import { ModalLabel } from '../../common/ModalSchema'
import FieldInput from './FieldInput'
import BoolField from './BoolField'
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
        <ModalLabel label='Er det behov for PVK?' tooltip='Det er behov for å gjøre en PVK dersom det er sannsynlig at behandlingen vil medføre en høy risiko for den registrertes rettigheter og friheter' />
        <BoolField fieldName="dpia.needForDpia" value={formikBag.values.dpia.needForDpia} omitUndefined={false} />
      </Block>
      {formikBag.values.dpia?.needForDpia === undefined ? (
        <></>
      ) : formikBag.values.dpia?.needForDpia ? (
        <>
          <Block {...rowBlockProps}>
            <ModalLabel label='Ref. til PVK' />
            <FieldInput fieldName="dpia.refToDpia" fieldValue={formikBag.values.dpia?.refToDpia} placeHolder='(f.eks. lenke til Websak, Confluence e.l.)' />
          </Block>
        </>
      ) : (
        <>
          <Block {...rowBlockProps}>
            <ModalLabel label='Begrunnelse' />
            <FieldNoDpiaReason formikBag={formikBag} />
          </Block>

          {formikBag.values.dpia.noDpiaReasons.filter((reason) => reason === 'OTHER').length > 0 && (
            <Block {...rowBlockProps}>
              <ModalLabel label='Spesifiser ved annet' />
              <FieldInput fieldName="dpia.grounds" fieldValue={formikBag.values.dpia?.grounds} />
            </Block>
          )}
        </>
      )}
    </>
  )
}

export default DpiaItems
