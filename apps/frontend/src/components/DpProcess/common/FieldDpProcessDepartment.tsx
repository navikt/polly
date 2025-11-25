import { Select } from '@navikt/ds-react'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { getAvdelingOptions, getSeksjonOptions } from '../../../api/NomApi'
import { IDpProcessFormValues, INomSeksjon, TOption } from '../../../constants'
import { ModalLabel } from '../../common/ModalSchema'
import { renderTagList } from '../../common/TagList'

interface IFieldDpProcessDepartment {
  department?: string
}

const FieldDpProcessDepartment = (props: IFieldDpProcessDepartment) => {
  const { department } = props
  const [alleAvdelingOptions, setAlleAvdelingOptions] = useState<TOption[]>([])
  const [value, setValue] = useState<string>(department ? department : '')
  const [seksjonForAvdeling, setSeksjonForAvdeling] = useState<TOption[]>([])

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
      <Field
        name="affiliation.nomDepartmentId"
        render={({ form }: FieldProps<IDpProcessFormValues>) => (
          <div className="w-full">
            <Select
              label=""
              hideLabel
              value={value}
              onChange={async (event) => {
                setValue(event.target.value)

                if (event.target.value !== form.values.affiliation.nomDepartmentId) {
                  await form.setFieldValue('affiliation.seksjoner', [])
                }

                await form.setFieldValue('affiliation.nomDepartmentId', event.target.value)
                await form.setFieldValue(
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
      />

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
                    label="Velg sekjson"
                    hideLabel
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
                    <option value="">Velg sekjson</option>
                    {seksjonForAvdeling.map((seksjon) => (
                      <option key={seksjon.value} value={seksjon.value}>
                        {seksjon.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div>
                    {renderTagList(
                      FieldArrayRenderProps.form.values.affiliation.seksjoner.map(
                        (seksjon: INomSeksjon) => seksjon.nomSeksjonName
                      ),
                      FieldArrayRenderProps
                    )}
                  </div>
                </div>
              </div>
            )}
          </FieldArray>
        </div>
      )}
    </div>
  )
}

export default FieldDpProcessDepartment
