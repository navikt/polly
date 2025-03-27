import { FormikProps } from 'formik'
import { IProcessFormValues } from '../../../constants'
import FieldNoDpiaReason from '../../common/FieldNoDpiaReason'
import { ModalLabel } from '../../common/ModalSchema'
import BoolField from './BoolField'
import FieldInput from './FieldInput'

interface IProps {
  formikBag: FormikProps<IProcessFormValues>
}

const DpiaItems = (props: IProps) => {
  const { formikBag } = props

  return (
    <>
      <div className="flex w-full mt-0">
        <ModalLabel
          label="Er det behov for PVK?"
          tooltip="Det er behov for å gjøre en PVK dersom det er sannsynlig at behandlingen vil medføre en høy risiko for den registrertes rettigheter og friheter"
        />
        <BoolField
          fieldName="dpia.needForDpia"
          value={formikBag.values.dpia.needForDpia}
          omitUndefined={false}
        />
      </div>
      {formikBag.values.dpia?.needForDpia === undefined ? (
        <></>
      ) : formikBag.values.dpia?.needForDpia ? (
        <>
          <div className="flex w-full mr-4">
            <ModalLabel label="Ref. til PVK" />
            <FieldInput
              fieldName="dpia.refToDpia"
              fieldValue={formikBag.values.dpia?.refToDpia}
              placeHolder="(f.eks. lenke til P360, Confluence e.l.)"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full mr-4">
            <ModalLabel label="Begrunnelse" />
            <FieldNoDpiaReason formikBag={formikBag} />
          </div>

          {formikBag.values.dpia.noDpiaReasons.filter((reason) => reason === 'OTHER').length >
            0 && (
            <div className="flex w-full mr-4">
              <ModalLabel label="Spesifiser ved annet" />
              <FieldInput fieldName="dpia.grounds" fieldValue={formikBag.values.dpia?.grounds} />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DpiaItems
