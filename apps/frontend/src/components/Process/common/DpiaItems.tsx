import { FormikProps } from 'formik'
import { IProcessFormValues } from '../../../constants'
import FieldNoDpiaReason from '../../common/FieldNoDpiaReason'
import { ModalLabel } from '../../common/ModalSchema'
import BoolField from './BoolField'
import FieldInput from './FieldInput'

interface IProps {
  formikBag: FormikProps<IProcessFormValues>
  layout?: 'horizontal' | 'vertical'
}

const DpiaItems = (props: IProps) => {
  const { formikBag } = props

  const stacked = props.layout === 'vertical'

  return (
    <>
      <div className={stacked ? 'w-full mt-0' : 'flex w-full mt-0'}>
        <ModalLabel
          fullwidth={stacked}
          label="Er det behov for PVK?"
          tooltip="Det er behov for å gjøre en PVK dersom det er sannsynlig at behandlingen vil medføre en høy risiko for den registrertes rettigheter og friheter"
        />
        {stacked ? (
          <div className="mt-2">
            <BoolField
              fieldName="dpia.needForDpia"
              value={formikBag.values.dpia.needForDpia}
              omitUndefined={false}
              direction="horizontal"
            />
          </div>
        ) : (
          <BoolField
            fieldName="dpia.needForDpia"
            value={formikBag.values.dpia.needForDpia}
            omitUndefined={false}
          />
        )}
      </div>
      {formikBag.values.dpia?.needForDpia === undefined ? (
        <></>
      ) : formikBag.values.dpia?.needForDpia ? (
        <>
          <div className={stacked ? 'w-full my-4' : 'flex w-full mr-4'}>
            <ModalLabel fullwidth={stacked} label="Ref. til PVK" />
            {stacked ? (
              <div className="mt-2">
                <FieldInput
                  fieldName="dpia.refToDpia"
                  fieldValue={formikBag.values.dpia?.refToDpia}
                  placeHolder="(f.eks. lenke til Public 360, Confluence e.l.)"
                />
              </div>
            ) : (
              <FieldInput
                fieldName="dpia.refToDpia"
                fieldValue={formikBag.values.dpia?.refToDpia}
                placeHolder="(f.eks. lenke til Public 360, Confluence e.l.)"
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div className={stacked ? 'w-full mt-4' : 'flex w-full mr-4'}>
            <ModalLabel fullwidth={stacked} label="Begrunnelse" />
            {stacked ? (
              <div className="mt-2">
                <FieldNoDpiaReason formikBag={formikBag} />
              </div>
            ) : (
              <FieldNoDpiaReason formikBag={formikBag} />
            )}
          </div>

          {formikBag.values.dpia.noDpiaReasons.filter((reason) => reason === 'OTHER').length >
            0 && (
            <div className={stacked ? 'w-full mt-4' : 'flex w-full mr-4'}>
              <ModalLabel fullwidth={stacked} label="Spesifiser ved annet" />
              {stacked ? (
                <div className="mt-2">
                  <FieldInput
                    fieldName="dpia.grounds"
                    fieldValue={formikBag.values.dpia?.grounds}
                  />
                </div>
              ) : (
                <FieldInput fieldName="dpia.grounds" fieldValue={formikBag.values.dpia?.grounds} />
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default DpiaItems
