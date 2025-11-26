import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getFylkerOptions } from '../../api/NomApi'
import { IDpProcessFormValues, INomSeksjon, IProcessFormValues, TOption } from '../../constants'
import { EListName, ICodelistProps } from '../../service/Codelist'
import { ModalLabel } from './ModalSchema'
import { renderTagList } from './TagList'

interface IFieldSubDepartmentsProps {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
  codelistUtils: ICodelistProps
}

const FieldSubDepartments = (props: IFieldSubDepartmentsProps) => {
  const { formikBag, codelistUtils } = props

  const [alleFylker, setAlleFylker] = useState<TOption[]>([])

  useEffect(() => {
    ;(async () => {
      await getFylkerOptions().then(setAlleFylker)
    })()
  }, [])

  return (
    <div>
      <FieldArray
        name="affiliation.subDepartments"
        render={(arrayHelpers: FieldArrayRenderProps) => (
          <div className="w-full">
            <div className="w-full">
              <Select
                label=""
                hideLabel
                onChange={(event) => {
                  if (event.target.value) {
                    arrayHelpers.form.setFieldValue('affiliation.subDepartments', [
                      ...formikBag.values.affiliation.subDepartments,
                      event.target.value,
                    ])
                  }
                }}
              >
                <option value="">Velg linje</option>
                {codelistUtils
                  .getParsedOptions(EListName.SUB_DEPARTMENT)
                  .filter((code) => !formikBag.values.affiliation.subDepartments.includes(code.id))
                  .map((code) => (
                    <option key={code.id} value={code.id}>
                      {code.label}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <div>
                {renderTagList(
                  formikBag.values.affiliation.subDepartments.map((subDepartment: string) =>
                    codelistUtils.getShortname(EListName.SUB_DEPARTMENT, subDepartment)
                  ),
                  arrayHelpers
                )}
              </div>
            </div>
          </div>
        )}
      />

      {formikBag.values.affiliation.subDepartments.includes('NAVFYLKE') && (
        <div>
          <ModalLabel label="Fylke" tooltip="Angi fylke." />

          <FieldArray name="affiliation.fylker">
            {(FieldArrayRenderProps: FieldArrayRenderProps) => (
              <div className="w-full">
                <div className="w-full">
                  <Select
                    label="Velg fylke"
                    hideLabel
                    onChange={async (event) => {
                      if (event.target.value) {
                        const selectedFylke = alleFylker.filter(
                          (fylke) => fylke.value === event.target.value
                        )[0]

                        const ikkeFinnesAlleredeIListe =
                          FieldArrayRenderProps.form.values.affiliation.fylker.filter(
                            (fylke: INomSeksjon) => fylke.nomSeksjonId === event.target.value
                          ).length === 0

                        if (ikkeFinnesAlleredeIListe) {
                          FieldArrayRenderProps.form.setFieldValue('affiliation.fylker', [
                            ...FieldArrayRenderProps.form.values.affiliation.fylker,
                            {
                              nomSeksjonId: selectedFylke.value,
                              nomSeksjonName: selectedFylke.label,
                            },
                          ])
                        }
                      }
                    }}
                  >
                    <option value="">Velg Fylke</option>
                    {alleFylker.map((fylke) => (
                      <option key={fylke.value} value={fylke.value}>
                        {fylke.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div>
                    {renderTagList(
                      FieldArrayRenderProps.form.values.affiliation.fylker.map(
                        (fylke: INomSeksjon) => fylke.nomSeksjonName
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

export default FieldSubDepartments
