import { Button, Modal, Radio, RadioGroup, Select } from '@navikt/ds-react'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import { useEffect, useState } from 'react'
import { getInformationTypesShort } from '../../../api/GetAllApi'
import { ELegalBasesUse, IInformationTypeShort, IPolicyFormValues } from '../../../constants'
import { EListName, ICodelistProps } from '../../../service/Codelist'
import { disableEnter } from '../../../util/helper-functions'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { renderTagList } from '../../common/TagList'
import { policySchema } from '../../common/schemaValidation'
import FieldLegalBasis from '../common/FieldLegalBasis'
import { TDocs } from './TablePolicy'

const FieldInformationType = () => {
  const [infoTypes, setInfoTypes] = useState<IInformationTypeShort[]>([])
  const [selectedValue, setSelectedValue] = useState<string>('')

  useEffect(() => {
    getInformationTypesShort().then((informationTypeShort: IInformationTypeShort[]) => {
      setInfoTypes([...informationTypeShort].sort((a, b) => a.name.localeCompare(b.name)))
    })
  }, [])

  return (
    <Field name="informationType">
      {({ form }: FieldProps<IPolicyFormValues>) => (
        <>
          <Select
            label="Opplysningstyper"
            hideLabel
            value={form.values.informationType ? form.values.informationType.id : selectedValue}
            onChange={(event) => {
              setSelectedValue(event.target.value)
              if (event.target.value && event.target.value !== '') {
                form.setFieldValue(
                  'informationType',
                  infoTypes.filter(
                    (infoType) => infoType.id === event.target.value
                  )[0] as IInformationTypeShort
                )
              }
            }}
            error={!!form.errors.informationType && !!form.submitCount}
          >
            <option value="">Søk opplysningstyper</option>
            {infoTypes.map((infoType: IInformationTypeShort) => (
              <option key={infoType.id} value={infoType.id}>
                {infoType.name}
              </option>
            ))}
          </Select>
        </>
      )}
    </Field>
  )
}

const FieldLegalBasesUse = (props: { legalBasesUse: ELegalBasesUse }) => {
  const [value, setValue] = useState(props.legalBasesUse)

  return (
    <Field name="legalBasesUse">
      {({ form }: FieldProps<IPolicyFormValues>) => (
        <div className="w-full">
          <RadioGroup
            value={value}
            legend=""
            hideLegend
            error={!!form.errors.legalBasesUse && !!form.submitCount}
            onChange={(selected) => {
              form.setFieldValue('legalBasesUse', selected)
              setValue(selected as ELegalBasesUse)
            }}
          >
            <Radio value={ELegalBasesUse.INHERITED_FROM_PROCESS}>
              Bruker behandlingens rettslige grunnlag
            </Radio>
            <Radio value={ELegalBasesUse.UNRESOLVED}>Uavklart</Radio>
            <Radio value={ELegalBasesUse.DEDICATED_LEGAL_BASES}>Har eget Behandlingsgrunnlag</Radio>
            <Radio value={ELegalBasesUse.EXCESS_INFO}>
              <span className="flex items-center gap-2">
                <span>Overskuddsinformasjon</span>
                <CustomizedStatefulTooltip content="Informasjon som er tilgjengelig i dokumenter eller systemet som brukes, uten at dette trengs eller brukes i behandlingen." />
              </span>
            </Radio>
          </RadioGroup>
        </div>
      )}
    </Field>
  )
}

type TModalPolicyProps = {
  title?: string
  isOpen: boolean
  isEdit: boolean
  initialValues: IPolicyFormValues
  docs?: TDocs
  errorOnCreate: any | undefined
  submit: (values: IPolicyFormValues) => void
  onClose: () => void
  addBatch?: () => void
  codelistUtils: ICodelistProps
}

const ModalPolicy = ({
  submit,
  errorOnCreate,
  onClose,
  isOpen,
  initialValues,
  docs,
  title,
  addBatch,
  codelistUtils,
}: TModalPolicyProps) => (
  <Modal onClose={onClose} open={isOpen} header={{ heading: title || '' }} width="750px">
    <div className="w-[750px] px-8">
      <Formik
        initialValues={initialValues}
        validationSchema={policySchema(codelistUtils.getCodes(EListName.SUBJECT_CATEGORY))}
        onSubmit={(values: IPolicyFormValues) => {
          submit(values)
          onClose()
        }}
      >
        {(formikBag: FormikProps<IPolicyFormValues>) => {
          return (
            <Form onKeyDown={disableEnter}>
              <Modal.Body>
                {addBatch && (
                  <div className="w-full mt-4">
                    <Button type="button" variant="secondary" size="small" onClick={addBatch}>
                      Legg til flere fra et system
                    </Button>
                  </div>
                )}

                <div className="flex w-full mt-4">
                  <ModalLabel label="Opplysningstype" fullwidth />
                </div>

                <div className="w-full mt-2">
                  <FieldInformationType />
                </div>
                <Error fieldName="informationType" fullWidth />

                <div className="flex w-full mt-4">
                  <ModalLabel label="Personkategori" fullwidth />
                </div>

                <div className="w-full mt-2">
                  <FieldArray
                    name="subjectCategories"
                    render={(arrayHelpers: FieldArrayRenderProps) => (
                      <div className="w-full">
                        <Select
                          label="Personkategori"
                          hideLabel
                          onChange={(event) => {
                            arrayHelpers.push(event.target.value ? event.target.value : null)
                          }}
                          error={
                            !!formikBag.errors.subjectCategories &&
                            !!formikBag.touched.subjectCategories
                          }
                        >
                          {codelistUtils
                            .getParsedOptionsFilterOutSelected(
                              EListName.SUBJECT_CATEGORY,
                              formikBag.values.subjectCategories
                            )
                            .map((catergories) => (
                              <option key={catergories.id} value={catergories.id}>
                                {catergories.label}
                              </option>
                            ))}
                        </Select>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {renderTagList(
                            codelistUtils.getShortnames(
                              EListName.SUBJECT_CATEGORY,
                              formikBag.values.subjectCategories
                            ),
                            arrayHelpers
                          )}
                        </div>
                      </div>
                    )}
                  />
                </div>
                <Error fieldName="subjectCategories" fullWidth />

                {!!formikBag.values.documentIds?.length && docs && (
                  <div className="flex w-full mt-4">
                    <ModalLabel label="Dokumenter" />
                    <FieldArray
                      name="documentIds"
                      render={(arrayHelpers: FieldArrayRenderProps) => (
                        <div className="w-full">
                          {renderTagList(
                            formikBag.values.documentIds.map((id: string) => docs[id].name),
                            arrayHelpers
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}

                <div className="flex w-full mt-4">
                  <ModalLabel label="Behandlingsgrunnlag" fullwidth />
                </div>

                <div className="w-full mt-2">
                  <FieldLegalBasesUse legalBasesUse={formikBag.values.legalBasesUse} />
                </div>
                <Error fieldName="legalBasesUse" fullWidth />

                {formikBag.values.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES && (
                  <FieldLegalBasis formikBag={formikBag} codelistUtils={codelistUtils} />
                )}
              </Modal.Body>
              <Error fieldName="legalBasesOpen" fullWidth={true} />

              <Modal.Footer>
                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" variant="tertiary" onClick={onClose}>
                    Avbryt
                  </Button>
                  <Button type="submit">Lagre</Button>
                </div>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </div>
  </Modal>
)

export default ModalPolicy
