import { Slider } from 'baseui/slider'
import { Field, FieldProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { DpProcessFormValues, ProcessFormValues } from '../../../constants'
import { theme } from '../../../util'
import FieldInput from '../../Process/common/FieldInput'
import { Error, ModalLabel } from '../../common/ModalSchema'

function sliderOverride(suffix: string) {
  return {
    ThumbValue: {
      component: (prop: any) => (
        <div
          style={{
            position: 'absolute',
            top: `-${theme.sizing.scale800}`,
            ...theme.typography.font200,
            backgroundColor: 'transparent',
            whiteSpace: 'nowrap',
          }}
        >
          {prop.children} {suffix}
        </div>
      ),
    },
  }
}

interface IRetentionItemsProps {
  formikBag: FormikProps<DpProcessFormValues>
}

const RetentionItems = (props: IRetentionItemsProps) => {
  const { formikBag } = props

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears = Math.floor(retention / 12)
  const retentionMonths = retention - retentionYears * 12

  useEffect(() => {
    ;(() => formikBag.setFieldValue('retention.retentionMonths', retention === 0 ? undefined : retention))()
  }, [retention])

  return (
    <>
      <div className="flex w-full mt-4">
        <ModalLabel
          label="Lagringsbehov for NAV"
          tooltip="Oppgi lagringstiden NAV er forpliktet til å overholde. Denne skal fremgå av databehandleravtalen med den behandlingsansvarlige."
        />
        <Field
          name="retention.retentionMonths"
          render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
            <>
              <div className="w-1/2 mt-[25px]">
                <Slider overrides={sliderOverride('År')} min={0} max={100} value={[retentionYears]} onChange={({ value }) => setRetention(value[0] * 12 + retentionMonths)} />
              </div>
              <div className="w-1/2 mt-[25px]">
                <Slider overrides={sliderOverride('Måneder')} min={0} max={11} value={[retentionMonths]} onChange={({ value }) => setRetention(value[0] + retentionYears * 12)} />
              </div>
            </>
          )}
        />
      </div>
      <Error fieldName="retention.retentionMonths" />

      <div className="flex w-full mt-4">
        <ModalLabel label="Lagringsbehovet beregnes fra følgende tidspunkt eller hendelse" />
        <div className="w-full">
          <FieldInput fieldName="retention.retentionStart" fieldValue={formikBag.values.retention.retentionStart} />
        </div>
      </div>
      <Error fieldName="retention.retentionStart" />
    </>
  )
}

export default RetentionItems
