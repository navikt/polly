import { TextField } from '@navikt/ds-react'
import { Field, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import FieldInput from '../../Process/common/FieldInput'
import { Error, ModalLabel } from '../../common/ModalSchema'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

interface IRetentionItemsProps {
  formikBag: FormikProps<IDpProcessFormValues>
}

const RetentionItems = (props: IRetentionItemsProps) => {
  const { formikBag } = props

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears: number = Math.floor(retention / 12)
  const retentionMonths: number = retention - retentionYears * 12

  useEffect(() => {
    ;(() =>
      formikBag.setFieldValue(
        'retention.retentionMonths',
        retention === 0 ? undefined : retention
      ))()
  }, [retention])

  return (
    <>
      <div className="w-full mt-4">
        <ModalLabel
          label="Lagringsbehov for NAV"
          tooltip="Oppgi lagringstiden NAV er forpliktet til å overholde. Denne skal fremgå av databehandleravtalen med den behandlingsansvarlige."
          fullwidth
        />
        <Field
          name="retention.retentionMonths"
          render={() => (
            <div className="mt-2 flex w-full gap-6">
              <div className="w-1/2">
                <TextField
                  label="År"
                  size="small"
                  type="number"
                  value={retentionYears}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    const years = Number.isNaN(raw) ? 0 : clamp(raw, 0, 100)
                    setRetention(years * 12 + retentionMonths)
                  }}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  label="Måneder"
                  size="small"
                  type="number"
                  value={retentionMonths}
                  min={0}
                  max={11}
                  onChange={(e) => {
                    const raw = Number(e.target.value)
                    const months = Number.isNaN(raw) ? 0 : clamp(raw, 0, 11)
                    setRetention(months + retentionYears * 12)
                  }}
                />
              </div>
            </div>
          )}
        />
      </div>
      <Error fieldName="retention.retentionMonths" />

      <div className="w-full mt-4">
        <ModalLabel
          label="Lagringsbehovet beregnes fra følgende tidspunkt eller hendelse"
          fullwidth
        />
        <div className="mt-2 w-full">
          <FieldInput
            fieldName="retention.retentionStart"
            fieldValue={formikBag.values.retention.retentionStart}
          />
        </div>
      </div>
      <Error fieldName="retention.retentionStart" />
    </>
  )
}

export default RetentionItems
