import { Button, KIND } from 'baseui/button'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Radio, RadioGroup } from 'baseui/radio'
import { Select, StatefulSelect } from 'baseui/select'
import { Tag, VARIANT } from 'baseui/tag'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps } from 'formik'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { getInformationTypesShort } from '../../../api'
import { InformationTypeShort, LegalBasesUse, PolicyFormValues } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'
import { disableEnter } from '../../../util/helper-functions'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { policySchema } from '../../common/schema'
import FieldLegalBasis from '../common/FieldLegalBasis'
import { Docs } from './TablePolicy'

const renderTagList = (list: string[], arrayHelpers: FieldArrayRenderProps) => (
  <React.Fragment>
    {list && list.length > 0
      ? list.map((item, index) => (
          <React.Fragment key={index}>
            {item ? (
              <Tag key={item} variant={VARIANT.outlined} onActionClick={() => arrayHelpers.remove(index)}>
                {item}
              </Tag>
            ) : null}
          </React.Fragment>
        ))
      : null}
  </React.Fragment>
)

const FieldInformationType = () => {
  const [infoTypes, setInfoTypes] = useState<InformationTypeShort[]>([])

  useEffect(() => {
    getInformationTypesShort().then((its) => {
      setInfoTypes([...its].sort((a, b) => a.name.localeCompare(b.name)))
    })
  }, [])

  return (
    <Field
      name="informationType"
      render={({ form }: FieldProps<PolicyFormValues>) => (
        <StatefulSelect
          maxDropdownHeight="400px"
          noResultsMsg="Ingen"
          options={infoTypes}
          placeholder={form.values.informationType ? '' : 'Søk opplysningsyper'}
          initialState={{ value: form.values.informationType }}
          onChange={(params) => form.setFieldValue('informationType', params.value[0] as InformationTypeShort)}
          error={!!form.errors.informationType && !!form.submitCount}
          labelKey="name"
        />
      )}
    />
  )
}

const FieldLegalBasesUse = (props: { legalBasesUse: LegalBasesUse }) => {
  const [value, setValue] = useState(props.legalBasesUse)

  return (
    <Field
      name="legalBasesUse"
      render={({ form }: FieldProps<PolicyFormValues>) => {
        return (
          <div className="w-full">
            <RadioGroup
              value={value}
              align="vertical"
              error={!!form.errors.legalBasesUse && !!form.submitCount}
              onChange={(event) => {
                const selected = (event.target as HTMLInputElement).value
                form.setFieldValue('legalBasesUse', selected)
                setValue(selected as LegalBasesUse)
              }}
            >
              <Radio value={LegalBasesUse.INHERITED_FROM_PROCESS}>Bruker behandlingens rettslige grunnlag</Radio>
              <Radio value={LegalBasesUse.UNRESOLVED}>Uavklart</Radio>
              <Radio value={LegalBasesUse.DEDICATED_LEGAL_BASES}>Har eget Behandlingsgrunnlag</Radio>
              <Radio value={LegalBasesUse.EXCESS_INFO}>
                <CustomizedStatefulTooltip content="Informasjon som er tilgjengelig i dokumenter eller systemet som brukes, uten at dette trengs eller brukes i behandlingen.">
                  Overskuddsinformasjon
                </CustomizedStatefulTooltip>
              </Radio>
            </RadioGroup>
          </div>
        )
      }}
    />
  )
}

type ModalPolicyProps = {
  title?: string
  isOpen: boolean
  isEdit: boolean
  initialValues: PolicyFormValues
  docs?: Docs
  errorOnCreate: any | undefined
  submit: (values: PolicyFormValues) => void
  onClose: () => void
  addBatch?: () => void
}

const ModalPolicy = ({ submit, errorOnCreate, onClose, isOpen, initialValues, docs, title, addBatch }: ModalPolicyProps) => (
  <Modal onClose={onClose} isOpen={isOpen} closeable={false} animate size={SIZE.auto} role={ROLE.dialog}>
    <div className="w-[750px] px-8">
      <Formik
        initialValues={initialValues}
        validationSchema={policySchema()}
        onSubmit={(values) => {
          submit(values)
          onClose()
        }}
      >
        {(formikBag: FormikProps<PolicyFormValues>) => {
          return (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>
                <div className="flex justify-around mb-8">
                  {title}
                  {addBatch && (
                    <Button type="button" kind="secondary" size="compact" onClick={addBatch}>
                      Legg til flere fra et system
                    </Button>
                  )}
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="flex w-full mt-4">
                  <ModalLabel label="Opplysningstype" />
                  <FieldInformationType />
                </div>
                <Error fieldName="informationType" />

                <div className="flex w-full mt-4">
                  <ModalLabel label="Personkategori" />
                  <FieldArray
                    name="subjectCategories"
                    render={(arrayHelpers: FieldArrayRenderProps) => (
                      <div className="w-full">
                        <Select
                          options={codelist.getParsedOptionsFilterOutSelected(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories)}
                          maxDropdownHeight="300px"
                          onChange={({ option }) => {
                            arrayHelpers.push(option ? option.id : null)
                          }}
                          error={!!formikBag.errors.subjectCategories && !!formikBag.touched.subjectCategories}
                        />
                        {renderTagList(codelist.getShortnames(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories), arrayHelpers)}
                      </div>
                    )}
                  />
                </div>
                <Error fieldName="subjectCategories" />

                {!!formikBag.values.documentIds?.length && docs && (
                  <div className="flex w-full mt-4">
                    <ModalLabel label="Dokumenter" />
                    <FieldArray
                      name="documentIds"
                      render={(arrayHelpers: FieldArrayRenderProps) => (
                        <div className="w-full">
                          {renderTagList(
                            formikBag.values.documentIds.map((id) => docs[id].name),
                            arrayHelpers,
                          )}
                        </div>
                      )}
                    />
                  </div>
                )}

                <div className="flex w-full mt-4">
                  <ModalLabel label="Behandlingsgrunnlag" />
                  <FieldLegalBasesUse legalBasesUse={formikBag.values.legalBasesUse} />
                </div>
                <Error fieldName="legalBasesUse" />

                {formikBag.values.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && <FieldLegalBasis formikBag={formikBag} />}
              </ModalBody>
              <Error fieldName="legalBasesOpen" fullWidth={true} />

              <ModalFooter>
                <div className="flex justify-end">
                  <div className="self-end">{errorOnCreate && <p>{errorOnCreate}</p>}</div>
                  <Button type="button" kind={KIND.tertiary} onClick={onClose}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Lagre</ModalButton>
                </div>
              </ModalFooter>
            </Form>
          )
        }}
      </Formik>
    </div>
  </Modal>
)

export default ModalPolicy
