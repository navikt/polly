import { Field, FieldProps, FormikProps } from 'formik'
import { DpProcessFormValues, ProcessFormValues } from '../../../constants'
import { default as React, useEffect, useState } from 'react'
import { Block, BlockProps } from 'baseui/block'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { theme } from '../../../util'
import { Slider } from 'baseui/slider'
import FieldInput from '../../Process/common/FieldInput'

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

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem',
}

const RetentionItems = (props: { formikBag: FormikProps<DpProcessFormValues> }) => {
  const { formikBag } = props

  const [retention, setRetention] = useState(formikBag.values.retention.retentionMonths || 0)
  const retentionYears = Math.floor(retention / 12)
  const retentionMonths = retention - retentionYears * 12

  useEffect(() => {
    ;(() => formikBag.setFieldValue('retention.retentionMonths', retention === 0 ? undefined : retention))()
  }, [retention])

  return (
    <>
      <>
        <Block {...rowBlockProps}>
          <ModalLabel label='Lagringsbehov for NAV' tooltip='Oppgi lagringstiden NAV er forpliktet til å overholde. Denne skal fremgå av databehandleravtalen med den behandlingsansvarlige.' />
          <Field
            name="retention.retentionMonths"
            render={({ field, form }: FieldProps<string, ProcessFormValues>) => (
              <>
                <Block width={'50%'} marginRight={'25px'}>
                  <Slider
                    overrides={sliderOverride('År')}
                    min={0}
                    max={100}
                    value={[retentionYears]}
                    onChange={({ value }) => setRetention(value[0] * 12 + retentionMonths)}
                  />
                </Block>
                <Block width={'50%'} marginLeft={'25px'}>
                  <Slider
                    overrides={sliderOverride('Måneder')}
                    min={0}
                    max={11}
                    value={[retentionMonths]}
                    onChange={({ value }) => setRetention(value[0] + retentionYears * 12)}
                  />
                </Block>
              </>
            )}
          />
        </Block>
        <Error fieldName="retention.retentionMonths" />

        <Block {...rowBlockProps}>
          <ModalLabel label='Lagringsbehovet beregnes fra følgende tidspunkt eller hendelse' />
          <Block width={'100%'}>
            <FieldInput fieldName="retention.retentionStart" fieldValue={formikBag.values.retention.retentionStart} />
          </Block>
        </Block>
        <Error fieldName="retention.retentionStart" />
      </>
    </>
  )
}

export default RetentionItems
