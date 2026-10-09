import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps, getIn } from 'formik'
import { useEffect, useState } from 'react'
import { EListName } from '@/constants/codelistConstant'
import { ICodelistProps } from '@/provider/kodeverkProvider'
import { EBehandlingsNivaa, IProcessFormValues } from '../../../constants'

const FieldPurpose = (props: {
  formikBag: FormikProps<IProcessFormValues>
  codelistUtils: ICodelistProps
}) => {
  const { formikBag, codelistUtils } = props
  const [selectedValue, setSelectedValue] = useState<string>(
    formikBag.values.purposes && formikBag.values.purposes.length > 0
      ? formikBag.values.purposes[0]
      : ''
  )

  const purposesErrorValue = getIn(formikBag.errors, 'purposes')
  const purposesError =
    typeof purposesErrorValue === 'string'
      ? purposesErrorValue
      : (getIn(formikBag.errors, 'purposes[0]') as string | undefined)
  const purposesTouched =
    !!getIn(formikBag.touched, 'purposes[0]') || !!getIn(formikBag.touched, 'purposes')
  const showError = !!purposesError && (purposesTouched || formikBag.submitCount > 0)

  useEffect(() => {
    ;(async () => {
      setSelectedValue(formikBag.values.purposes[0])
    })()
  }, [formikBag])

  return (
    <FieldArray
      name='purposes'
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className='flex-1 min-w-0'>
          <Select
            disabled={
              formikBag.values.behandlingsNivaa === EBehandlingsNivaa.UNDERORDNET &&
              formikBag.values.overordnetBehandling !== undefined
            }
            className='w-full'
            id='purposes'
            label='Velg behandlingsaktivitet'
            hideLabel
            value={selectedValue}
            error={showError ? purposesError : undefined}
            onChange={(event) => {
              setSelectedValue(event.target.value)
              arrayHelpers.form.setFieldValue('purposes', [event.target.value])
              arrayHelpers.form.setFieldTouched('purposes', true, false)
              arrayHelpers.form.setFieldTouched('purposes[0]', true, false)
            }}
          >
            <option value=''>Velg behandlingsaktivitet</option>
            {codelistUtils.getParsedOptions(EListName.PURPOSE).map((codeList, index) => (
              <option key={index + '_' + codeList.id} value={codeList.id}>
                {codeList.label}
              </option>
            ))}
          </Select>
        </div>
      )}
    />
  )
}

export default FieldPurpose
