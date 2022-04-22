import React, {useEffect} from "react";
import CardLegalBasis from "../Accordion/CardLegalBasis";
import {intl} from "../../../util";
import {Block} from "baseui/block";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {SensitivityLevel} from "../../../service/Codelist";
import {Plus} from "baseui/icon";
import {ListLegalBases} from "../../common/LegalBasis";
import {FieldArray, FormikProps} from "formik";
import {DisclosureFormValues, LegalBasisFormValues, PolicyFormValues, ProcessFormValues} from "../../../constants";
import CustomizedStatefulTooltip from "../../common/CustomizedStatefulTooltip";

type fieldLegalBasisProps = {
  formikBag: FormikProps<ProcessFormValues> | FormikProps<PolicyFormValues> | FormikProps<DisclosureFormValues>
  openArt6OnEmpty?: boolean
}

const FieldLegalBasis = (props: fieldLegalBasisProps) => {
  const {formikBag} = props

  const [selectedLegalBasis, setSelectedLegalBasis] = React.useState<LegalBasisFormValues>()
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState<number>()
  const [sensitivityLevel, setSensitivityLevel] = React.useState<SensitivityLevel>(SensitivityLevel.ART6)

  // Open legalBases if this field is rendered and no legalBases exist.
  useEffect(() => {
    if (formikBag.values.legalBases.length == 0 && props.openArt6OnEmpty) {
      formikBag.setFieldValue('legalBasesOpen', true)
    }
  }, [])

  return (<FieldArray
    name='legalBases'
    render={arrayHelpers => (
      <>
        {formikBag.values.legalBasesOpen ? (
          <CardLegalBasis
            titleSubmitButton={selectedLegalBasis ? intl.update : intl.add}
            initValue={selectedLegalBasis || {}}
            hideCard={() => {
              formikBag.setFieldValue('legalBasesOpen', false)
              setSelectedLegalBasis(undefined)
            }}
            submit={values => {
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
        ) : (
          <Block display={"flex"} width={"100%"}>
            <Block width={"100%"}>
              <CustomizedStatefulTooltip content={intl.article6HelpText}>
                <Block>
                  <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={() => {
                      formikBag.setFieldValue('legalBasesOpen', true)
                      setSensitivityLevel(SensitivityLevel.ART6)
                    }}
                    startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
                  >
                    {intl.addArticle6}
                  </Button>
                </Block>
              </CustomizedStatefulTooltip>

              <Block>
                <ListLegalBases
                  sensitivityLevel={SensitivityLevel.ART6}
                  legalBases={formikBag.values.legalBases}
                  onRemove={(index) => arrayHelpers.remove(index)}
                  onEdit={
                    (index) => {
                      setSensitivityLevel(SensitivityLevel.ART6)
                      setSelectedLegalBasis(formikBag.values.legalBases[index])
                      setSelectedLegalBasisIndex(index)
                      formikBag.setFieldValue('legalBasesOpen', true)
                    }
                  }
                />
              </Block>
            </Block>

            <Block width={"100%"}>
              <CustomizedStatefulTooltip content={intl.article9HelpText}>
                <Block>
                  <Button
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={() => {
                      formikBag.setFieldValue('legalBasesOpen', true)
                      setSensitivityLevel(SensitivityLevel.ART9)
                    }}
                    startEnhancer={() => <Block display='flex' justifyContent='center'><Plus size={22}/></Block>}
                  >
                    {intl.addArticle9}
                  </Button>
                </Block>
              </CustomizedStatefulTooltip>
              <Block>
                <ListLegalBases
                  sensitivityLevel={SensitivityLevel.ART9}
                  legalBases={formikBag.values.legalBases}
                  onRemove={(index) => {
                    arrayHelpers.remove(index)
                  }}
                  onEdit={
                    (index) => {
                      setSensitivityLevel(SensitivityLevel.ART9)
                      setSelectedLegalBasis(formikBag.values.legalBases[index])
                      setSelectedLegalBasisIndex(index)
                      formikBag.setFieldValue('legalBasesOpen', true)
                    }
                  }
                />
              </Block>
            </Block>
          </Block>
        )}
      </>
    )}
  />)
}

export default FieldLegalBasis
