import { Button, Tooltip } from '@navikt/ds-react'
import { Plus } from 'baseui/icon'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import {
  IDisclosureFormValues,
  ILegalBasisFormValues,
  IPolicyFormValues,
  IProcessFormValues,
} from '../../../constants'
import { ESensitivityLevel, ICodelistProps } from '../../../service/Codelist'
import { ListLegalBases } from '../../common/LegalBasis'
import CardLegalBasis from '../Accordion/CardLegalBasis'

type TFieldLegalBasisProps = {
  formikBag:
    | FormikProps<IProcessFormValues>
    | FormikProps<IPolicyFormValues>
    | FormikProps<IDisclosureFormValues>
  openArt6OnEmpty?: boolean
  codelistUtils: ICodelistProps
}

const FieldLegalBasis = (props: TFieldLegalBasisProps) => {
  const { formikBag, codelistUtils } = props

  const [selectedLegalBasis, setSelectedLegalBasis] = useState<ILegalBasisFormValues>()
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = useState<number>()
  const [sensitivityLevel, setSensitivityLevel] = useState<ESensitivityLevel>(
    ESensitivityLevel.ART6
  )

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
              submit={(values: ILegalBasisFormValues) => {
                if (!values) return
                if (selectedLegalBasis && selectedLegalBasisIndex !== undefined) {
                  arrayHelpers.replace(selectedLegalBasisIndex, values)
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
                <Tooltip content="Alle behandlinger av personopplysninger krever et behandlingsgrunnlag iht. personopplysningsloven artikkel 6.">
                  <div>
                    <Button
                      size="xsmall"
                      type="button"
                      variant="tertiary"
                      onClick={() => {
                        formikBag.setFieldValue('legalBasesOpen', true)
                        setSensitivityLevel(ESensitivityLevel.ART6)
                      }}
                      icon={
                        <div className="flex justify-center">
                          <Plus size={22} />
                        </div>
                      }
                    >
                      Behandlingsgrunnlag
                    </Button>
                  </div>
                </Tooltip>

                <div>
                  <ListLegalBases
                    codelistUtils={codelistUtils}
                    sensitivityLevel={ESensitivityLevel.ART6}
                    legalBases={formikBag.values.legalBases}
                    onRemove={(index: number) => arrayHelpers.remove(index)}
                    onEdit={(index: number) => {
                      setSensitivityLevel(ESensitivityLevel.ART6)
                      setSelectedLegalBasis(formikBag.values.legalBases[index])
                      setSelectedLegalBasisIndex(index)
                      formikBag.setFieldValue('legalBasesOpen', true)
                    }}
                  />
                </div>
              </div>

              <div className="w-full">
                <Tooltip content="Alle behandlinger av særlige kategorier (sensitive) av personopplysninger krever i tillegg et behandlingsgrunnlag iht personopplysningsloven artikkel 9.">
                  <Button
                    size="xsmall"
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                      formikBag.setFieldValue('legalBasesOpen', true)
                      setSensitivityLevel(ESensitivityLevel.ART9)
                    }}
                    icon={
                      <div className="flex justify-center">
                        <Plus size={22} />
                      </div>
                    }
                  >
                    Behandlingsgrunnlag for særlige kategorier
                  </Button>
                </Tooltip>
                <div>
                  <ListLegalBases
                    codelistUtils={codelistUtils}
                    sensitivityLevel={ESensitivityLevel.ART9}
                    legalBases={formikBag.values.legalBases}
                    onRemove={(index: number) => {
                      arrayHelpers.remove(index)
                    }}
                    onEdit={(index) => {
                      setSensitivityLevel(ESensitivityLevel.ART9)
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
