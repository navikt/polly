import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getFylkerOptions, searchNavKontorOptions } from '../../api/NomApi'
import { IDpProcessFormValues, INomData, IProcessFormValues, TOption } from '../../constants'
import { EListName, ICodelistProps } from '../../service/Codelist'
import CustomSearchSelect from './AsyncSelectComponents'
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
        <div className="mt-3">
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
                            (fylke: INomData) => fylke.nomId === event.target.value
                          ).length === 0

                        if (ikkeFinnesAlleredeIListe) {
                          FieldArrayRenderProps.form.setFieldValue('affiliation.fylker', [
                            ...FieldArrayRenderProps.form.values.affiliation.fylker,
                            {
                              nomId: selectedFylke.value,
                              nomName: selectedFylke.label,
                            },
                          ])
                        }
                      }
                    }}
                  >
                    <option value="">Velg Fylke</option>
                    {alleFylker.map((fylke, index) => (
                      <option key={`${fylke.value}_${index}`} value={fylke.value}>
                        {fylke.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div>
                    {renderTagList(
                      FieldArrayRenderProps.form.values.affiliation.fylker.map(
                        (fylke: INomData) => fylke.nomName
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

      {formikBag.values.affiliation.subDepartments.includes('NAVKONTORSTAT') && (
        <div className="mt-3">
          <ModalLabel label="Kontor" tooltip="Angi Nav kontor." />

          <FieldArray name="affiliation.navKontorer">
            {(fieldArrayRenderProps: FieldArrayRenderProps) => (
              <div className="w-full">
                <div className="w-full">
                  <CustomSearchSelect
                    ariaLabel="Søk etter Nav kontor"
                    placeholder="Søk etter Nav kontor"
                    loadOptions={searchNavKontorOptions}
                    onChange={async (event: any) => {
                      if (event) {
                        const ikkeFinnesAlleredeIListe =
                          fieldArrayRenderProps.form.values.affiliation.navKontorer.filter(
                            (navKontor: INomData) => navKontor.nomId === event.value
                          ).length === 0

                        if (ikkeFinnesAlleredeIListe) {
                          fieldArrayRenderProps.form.setFieldValue('affiliation.navKontorer', [
                            ...fieldArrayRenderProps.form.values.affiliation.navKontorer,
                            {
                              nomId: event.value,
                              nomName: event.label,
                            },
                          ])
                        }
                      }
                    }}
                  />
                </div>
                <div>
                  <div>
                    {renderTagList(
                      fieldArrayRenderProps.form.values.affiliation.navKontorer.map(
                        (navKontor: INomData) => navKontor.nomName
                      ),
                      fieldArrayRenderProps
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
