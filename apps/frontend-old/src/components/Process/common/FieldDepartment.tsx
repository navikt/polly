import { Select } from '@navikt/ds-react'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  getIn,
  useFormikContext,
} from 'formik'
import { useEffect, useState } from 'react'
import { getAvdelingOptions, getSeksjonOptions } from '../../../api/NomApi'
import { INomSeksjon, IProcessFormValues, TOption } from '../../../constants'
import { ModalLabel } from '../../common/ModalSchema'
import { renderTagList } from '../../common/TagList'

interface IFieldDepartmentProps {
  department?: string
}

const FieldDepartment = (props: IFieldDepartmentProps) => {
  const { department } = props
  const { errors, touched, submitCount, values, setFieldValue } =
    useFormikContext<IProcessFormValues>()
  const [alleAvdelingOptions, setAlleAvdelingOptions] = useState<TOption[]>([])
  const [value, setValue] = useState<string>(department ? department : '')
  const [seksjonForAvdeling, setSeksjonForAvdeling] = useState<TOption[]>([])

  const departmentHasError = !!getIn(errors, 'affiliation.nomDepartmentId')
  const departmentTouched = !!getIn(touched, 'affiliation.nomDepartmentId')
  const showDepartmentError = departmentHasError && (departmentTouched || submitCount > 0)

  const seksjonerHasError = !!getIn(errors, 'affiliation.seksjoner')
  const seksjonerTouched = !!getIn(touched, 'affiliation.seksjoner')
  const showSeksjonerError = seksjonerHasError && (seksjonerTouched || submitCount > 0)

  useEffect(() => {
    const current = values.affiliation?.seksjoner ?? []
    const cleaned = current.filter((s) => !!s?.nomSeksjonId && !!s?.nomSeksjonName)

    if (cleaned.length !== current.length) {
      setFieldValue('affiliation.seksjoner', cleaned, false)
    }
  }, [setFieldValue, values.affiliation?.seksjoner])

  useEffect(() => {
    ;(async () => {
      await getAvdelingOptions().then(setAlleAvdelingOptions)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (value !== '' && value !== undefined) {
        await getSeksjonOptions(value).then(setSeksjonForAvdeling)
      }
    })()
  }, [value])

  return (
    <div>
      <Field name="affiliation.nomDepartmentId">
        {(fieldProps: FieldProps) => (
          <div className="w-full">
            <Select
              id="affiliation-nomDepartmentId"
              label="Velg avdeling"
              hideLabel
              error={showDepartmentError}
              value={value}
              onChange={async (event) => {
                setValue(event.target.value)

                if (event.target.value !== fieldProps.form.values.affiliation.nomDepartmentId) {
                  await fieldProps.form.setFieldValue('affiliation.seksjoner', [])
                }

                await fieldProps.form.setFieldValue(
                  'affiliation.nomDepartmentId',
                  event.target.value
                )
                await fieldProps.form.setFieldValue(
                  'affiliation.nomDepartmentName',
                  alleAvdelingOptions.filter((avdeling) => avdeling.value === event.target.value)[0]
                    .label
                )
              }}
            >
              <option value="">Velg avdeling</option>
              {alleAvdelingOptions.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </Field>

      {value !== '' && value !== undefined && (
        <div className="mt-3">
          <ModalLabel
            label="Seksjon"
            tooltip="Angi hvilken seksjon som har hovedansvar for behandlingen."
          />
          <FieldArray name="affiliation.seksjoner">
            {(FieldArrayRenderProps: FieldArrayRenderProps) => (
              <div className="w-full">
                <div className="w-full">
                  <Select
                    id="affiliation-seksjoner-nomSeksjonId"
                    label="Velg seksjon"
                    hideLabel
                    error={showSeksjonerError}
                    onChange={async (event) => {
                      if (event.target.value) {
                        const seksjon = seksjonForAvdeling.filter(
                          (seksjon) => seksjon.value === event.target.value
                        )[0]

                        const ikkeFinnesAlleredeIListe =
                          FieldArrayRenderProps.form.values.affiliation.seksjoner.filter(
                            (seksjon: INomSeksjon) => seksjon.nomSeksjonId === event.target.value
                          ).length === 0

                        if (ikkeFinnesAlleredeIListe) {
                          FieldArrayRenderProps.form.setFieldValue('affiliation.seksjoner', [
                            ...FieldArrayRenderProps.form.values.affiliation.seksjoner,
                            { nomSeksjonId: seksjon.value, nomSeksjonName: seksjon.label },
                          ])
                        }
                      }
                    }}
                  >
                    <option value="">Velg seksjon</option>
                    {seksjonForAvdeling.map((seksjon) => (
                      <option key={seksjon.value} value={seksjon.value}>
                        {seksjon.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {renderTagList(
                    FieldArrayRenderProps.form.values.affiliation.seksjoner.map(
                      (seksjon: INomSeksjon) => seksjon.nomSeksjonName
                    ),
                    FieldArrayRenderProps
                  )}
                </div>
              </div>
            )}
          </FieldArray>
        </div>
      )}
    </div>
  )
}

export default FieldDepartment
