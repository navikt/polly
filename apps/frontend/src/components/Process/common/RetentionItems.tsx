import { TextField } from '@navikt/ds-react'
import { Field, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { Error, ModalLabel } from '../../common/ModalSchema'
import BoolField from './BoolField'
import FieldInput from './FieldInput'

interface IProps {
  formikBag: FormikProps<IProcessFormValues>
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const RetentionItems = (props: IProps) => {
  const { formikBag } = props

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears = Math.floor(retention / 12)
  const retentionMonths = retention - retentionYears * 12

  useEffect(() => {
    ;(() =>
      formikBag.setFieldValue(
        'retention.retentionMonths',
        retention === 0 ? undefined : retention
      ))()
  }, [retention])

  return (
    <>
      <div className="w-full mt-0">
        <ModalLabel fullwidth label="Omfattes av Navs bevarings- og kassasjonsvedtak?" />
        <div className="mt-2">
          <BoolField
            fieldName="retention.retentionPlan"
            value={formikBag.values.retention.retentionPlan}
            direction="horizontal"
          />
        </div>
      </div>

      {
        <>
          <div className="w-full mt-4">
            <ModalLabel
              fullwidth
              label="Lagringsbehov for Nav"
              tooltip="Det er hvor lenge Nav har behov for tilgang til opplysningene vi ønsker svar på her. Når den tiden nås skal opplysningene enten kasseres eller gjøres klar for avlevering til Arkivverket."
            />
            <Field
              name="retention.retentionMonths"
              render={() => (
                <div className="mt-2 flex gap-6">
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
          <Error fieldName="retention.retentionMonths" fullWidth={true} />

          <div className="w-full mt-4">
            <ModalLabel
              fullwidth
              label="Lagringsbehovet beregnes fra følgende tidspunkt eller hendelse"
              tooltip="Oppgi når lagringstiden begynner å løpe. Dette er tidspunktet vi regner lagringsbehovet fra. For eksempel begynner lagringstiden for opplysninger i flere HR-behandlinger å løpe fra ansettelsesforholdets avslutning. Andre eksempler for bruk av personopplysninger om etatens brukere kan være fra søknad mottatt, fødsel, død, søknadens virkningstidspunkt o.l."
            />
            <div className="mt-2 w-full">
              <FieldInput
                fieldName="retention.retentionStart"
                fieldValue={formikBag.values.retention.retentionStart}
              />
            </div>
          </div>
          <Error fieldName="retention.retentionStart" fullWidth={true} />
        </>
      }
      <div className="w-full mt-4">
        <ModalLabel fullwidth label="Ref. til relevant dokumentasjon" />
        <div className="mt-2">
          <FieldInput
            fieldName="retention.retentionDescription"
            fieldValue={formikBag.values.retention.retentionDescription}
            placeHolder="(f.eks. lenke til Public 360, Confluence e.l.)"
          />
        </div>
      </div>
      <Error fieldName="retention.retentionDescription" fullWidth={true} />
    </>
  )
}

export default RetentionItems
