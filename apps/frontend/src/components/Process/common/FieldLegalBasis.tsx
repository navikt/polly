import { Button, SIZE as ButtonSize, KIND } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { DisclosureFormValues, LegalBasisFormValues, PolicyFormValues, ProcessFormValues } from '../../../constants'
import { SensitivityLevel } from '../../../service/Codelist'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { ListLegalBases } from '../../common/LegalBasis'
import CardLegalBasis from '../Accordion/CardLegalBasis'

type fieldLegalBasisProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<PolicyFormValues> | FormikProps<DisclosureFormValues>
  openArt6OnEmpty?: boolean
}

const FieldLegalBasis = (props: fieldLegalBasisProps) => {
  const { formikBag } = props

  const [selectedLegalBasis, setSelectedLegalBasis] = useState<LegalBasisFormValues>()
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = useState<number>()
  const [sensitivityLevel, setSensitivityLevel] = useState<SensitivityLevel>(SensitivityLevel.ART6)

  // Open legalBases if this field is rendered and no legalBases exist.
  useEffect(() => {
    if (formikBag.values.legalBases.length == 0 && props.openArt6OnEmpty) {
      formikBag.setFieldValue('legalBasesOpen', true)
    }
  }, [])

  return (
    <FieldArray
      name="legalBases"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          {formikBag.values.legalBasesOpen && (
            <CardLegalBasis
              titleSubmitButton={selectedLegalBasis ? 'Oppdater' : 'Legg til'}
              initValue={selectedLegalBasis || {}}
              hideCard={() => {
                formikBag.setFieldValue('legalBasesOpen', false)
                setSelectedLegalBasis(undefined)
              }}
              submit={(values: LegalBasisFormValues) => {
                if (!values) return
                if (selectedLegalBasis) {
                  arrayHelpers.replace(selectedLegalBasisIndex!, values)
                  setSelectedLegalBasis(undefined)
                } else {
                  arrayHelpers.push(values)
                }
                formikBag.setFieldValue('legalBasesOpen', false)
              }}
              sensitivityLevel={sensitivityLevel}
            />
          )}
          {!formikBag.values.legalBasesOpen && (
            <div className="flex w-full">
              <div className="w-full">
                <CustomizedStatefulTooltip content="Alle behandlinger av personopplysninger krever et behandlingsgrunnlag iht. personopplysningsloven artikkel 6.">
                  <div>
                    <Button
                      size={ButtonSize.compact}
                      kind={KIND.tertiary}
                      onClick={() => {
                        formikBag.setFieldValue('legalBasesOpen', true)
                        setSensitivityLevel(SensitivityLevel.ART6)
                      }}
                      startEnhancer={() => (
                        <div className="flex justify-center">
                          <Plus size={22} />
                        </div>
                      )}
                    >
                      Behandlingsgrunnlag
                    </Button>
                  </div>
                </CustomizedStatefulTooltip>

                <div>
                  <ListLegalBases
                    sensitivityLevel={SensitivityLevel.ART6}
                    legalBases={formikBag.values.legalBases}
                    onRemove={(index: number) => arrayHelpers.remove(index)}
                    onEdit={(index: number) => {
                      setSensitivityLevel(SensitivityLevel.ART6)
                      setSelectedLegalBasis(formikBag.values.legalBases[index])
                      setSelectedLegalBasisIndex(index)
                      formikBag.setFieldValue('legalBasesOpen', true)
                    }}
                  />
                </div>
              </div>

              <div className="w-full">
                <CustomizedStatefulTooltip content="Alle behandlinger av særlige kategorier (sensitive) av personopplysninger krever i tillegg et behandlingsgrunnlag iht personopplysningsloven artikkel 9.">
                  <div>
                    <Button
                      size={ButtonSize.compact}
                      kind={KIND.tertiary}
                      onClick={() => {
                        formikBag.setFieldValue('legalBasesOpen', true)
                        setSensitivityLevel(SensitivityLevel.ART9)
                      }}
                      startEnhancer={() => (
                        <div className="flex justify-center">
                          <Plus size={22} />
                        </div>
                      )}
                    >
                      Behandlingsgrunnlag for særlige kategorier
                    </Button>
                  </div>
                </CustomizedStatefulTooltip>
                <div>
                  <ListLegalBases
                    sensitivityLevel={SensitivityLevel.ART9}
                    legalBases={formikBag.values.legalBases}
                    onRemove={(index: number) => {
                      arrayHelpers.remove(index)
                    }}
                    onEdit={(index) => {
                      setSensitivityLevel(SensitivityLevel.ART9)
                      setSelectedLegalBasis(formikBag.values.legalBases[index])
                      setSelectedLegalBasisIndex(index)
                      formikBag.setFieldValue('legalBasesOpen', true)
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    />
  )
}

export default FieldLegalBasis
