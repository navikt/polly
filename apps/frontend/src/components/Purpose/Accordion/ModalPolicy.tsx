import * as React from 'react'
import { KeyboardEvent, useState } from 'react'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps, } from 'formik'
import { Block, BlockProps } from 'baseui/block'
import { Radio, RadioGroup } from 'baseui/radio'
import { Plus } from 'baseui/icon'
import { Select, StatefulSelect, TYPE } from 'baseui/select'

import CardLegalBasis from './CardLegalBasis'
import { codelist, ListName, SensitivityLevel } from '../../../service/Codelist'
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button'
import { InformationTypeShort, LegalBasesUse, LegalBasisFormValues, PolicyFormValues } from '../../../constants'
import { ListLegalBases } from '../../common/LegalBasis'
import { useInfoTypeSearch } from '../../../api'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { intl } from '../../../util'
import { policySchema } from '../../common/schema'
import { Tag, VARIANT } from 'baseui/tag'
import { Docs } from './TablePolicy'


const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem'
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  width: '100%',
  marginTop: '1rem'
}

const renderTagList = (list: string[], arrayHelpers: FieldArrayRenderProps) => {
  return (
    <React.Fragment>
      {list && list.length > 0
        ? list.map((item, index) => (
          <React.Fragment key={index}>
            {item ? (
              <Tag
                key={item}
                variant={VARIANT.outlined}
                onActionClick={() =>
                  arrayHelpers.remove(index)
                }
              >
                {item}
              </Tag>
            ) : null}
          </React.Fragment>
        ))
        : null}
    </React.Fragment>
  )
}

const FieldInformationType = () => {
  const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()

  return (
    <Field
      name="informationType"
      render={({ form }: FieldProps<PolicyFormValues>) => (
        <StatefulSelect
          maxDropdownHeight="400px"
          searchable={true}
          noResultsMsg={intl.emptyTable}
          type={TYPE.search}
          options={infoTypeSearchResult}
          placeholder={form.values.informationType ? '' : intl.informationTypeSearch}
          initialState={{ value: form.values.informationType }}
          onInputChange={event => setInfoTypeSearch(event.currentTarget.value)}
          onChange={params => form.setFieldValue('informationType', params.value[0] as InformationTypeShort)}
          error={!!form.errors.informationType && !!form.submitCount}
          filterOptions={options => options}
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
          <Block width="100%">
            <RadioGroup
              value={value}
              align="vertical" isError={!!form.errors.legalBasesUse && !!form.submitCount}
              onChange={e => {
                const selected = (e.target as HTMLInputElement).value
                form.setFieldValue('legalBasesUse', selected)
                setValue(selected as LegalBasesUse)
              }}
            >
              <Radio value={LegalBasesUse.INHERITED_FROM_PROCESS}>{intl.legalBasesProcess}</Radio>
              <Radio value={LegalBasesUse.UNRESOLVED}>{intl.legalBasesUndecided}</Radio>
              <Radio value={LegalBasesUse.DEDICATED_LEGAL_BASES}>{intl.legalBasesOwn}</Radio>
              <Radio value={LegalBasesUse.EXCESS_INFO}>{intl.EXCESS_INFO}</Radio>
            </RadioGroup>
          </Block>
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
};

const ModalPolicy = ({ submit, errorOnCreate, onClose, isOpen, initialValues, docs, title }: ModalPolicyProps) => {
  const [selectedLegalBasis, setSelectedLegalBasis] = React.useState<LegalBasisFormValues>()
  const [selectedLegalBasisIndex, setSelectedLegalBasisIndex] = React.useState<number>()
  const [sensitivityLevel, setSensitivityLevel] = React.useState<SensitivityLevel>(SensitivityLevel.ART6)

  const disableEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      closeable={false}
      animate
      size={SIZE.auto}
      role={ROLE.dialog}
      unstable_ModalBackdropScroll={true}
    >
      <Block {...modalBlockProps}>
        <Formik
          initialValues={initialValues} validationSchema={policySchema()}
          onSubmit={(values) => {
            submit(values)
            onClose()
          }}
          render={(formikBag: FormikProps<PolicyFormValues>) => (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>
                <Block display="flex" justifyContent="center" marginBottom="2rem">
                  {title}
                </Block>
              </ModalHeader>

              <ModalBody>
                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.informationType} />
                  <FieldInformationType />
                </Block>
                <Error fieldName="informationType" />

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.subjectCategories} />
                  <FieldArray
                    name="subjectCategories"
                    render={arrayHelpers => (
                      <Block width="100%">
                        <Select
                          options={codelist.getParsedOptionsFilterOutSelected(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories)}
                          maxDropdownHeight="300px"
                          onChange={({ option }) => {
                            arrayHelpers.push(option ? option.id : null)
                          }}
                          error={!!arrayHelpers.form.errors.sources && !!arrayHelpers.form.submitCount}
                        />
                        {renderTagList(codelist.getShortnames(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories), arrayHelpers)}
                      </Block>
                    )}
                  />
                </Block>
                <Error fieldName="subjectCategories" />

                {!!formikBag.values.documentIds?.length && docs &&
                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.documents} />
                    <FieldArray name="documentIds"
                      render={arrayHelpers => (
                        <Block width='100%'>{renderTagList(formikBag.values.documentIds.map(id => docs[id].name), arrayHelpers)}</Block>
                      )} />
                  </Block>
                }

                <Block {...rowBlockProps}>
                  <ModalLabel label={intl.legalBasesShort} />
                  <FieldLegalBasesUse legalBasesUse={formikBag.values.legalBasesUse} />
                </Block>
                <Error fieldName="legalBasesUse" />

                {formikBag.values.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && (
                  <FieldArray
                    name="legalBases"
                    render={arrayHelpers => (
                      <React.Fragment>
                        {formikBag.values.legalBasesOpen ? (
                          <Block width="100%" marginTop="2rem">
                            <CardLegalBasis
                              titleSubmitButton={selectedLegalBasis ? intl.update : intl.add}
                              initValue={selectedLegalBasis || {}}
                              sensitivityLevel={sensitivityLevel}
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
                            />
                          </Block>
                        ) : (
                            <Block {...rowBlockProps}>
                              <Block width={"100%"}>
                                <Button
                                  size={ButtonSize.compact}
                                  kind={KIND.minimal}
                                  onClick={() => {
                                    formikBag.setFieldValue('legalBasesOpen', true)
                                    setSensitivityLevel(SensitivityLevel.ART6)
                                  }}
                                  startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                >
                                  {intl.addArticle6}
                                </Button>
                                <Block>
                                  <ListLegalBases
                                    legalBases={formikBag.values.legalBases}
                                    onRemove={(index) => arrayHelpers.remove(index)}
                                    onEdit={(index) => {
                                      setSelectedLegalBasis(formikBag.values.legalBases.filter(l => codelist.isArt6(l.gdpr))[index])
                                      setSelectedLegalBasisIndex(index)
                                      formikBag.setFieldValue('legalBasesOpen', true)
                                    }}
                                    sensitivityLevel={SensitivityLevel.ART6}
                                  />
                                </Block>
                              </Block>

                              <Block width={"100%"}>
                                <Button
                                  size={ButtonSize.compact}
                                  kind={KIND.minimal}
                                  onClick={() => {
                                    formikBag.setFieldValue('legalBasesOpen', true)
                                    setSensitivityLevel(SensitivityLevel.ART9)
                                  }}
                                  startEnhancer={() => <Block display="flex" justifyContent="center"><Plus size={22} /></Block>}
                                >
                                  {intl.addArticle9}
                                </Button>
                                <Block>
                                  <ListLegalBases
                                    legalBases={formikBag.values.legalBases.filter(l => codelist.isArt9(l.gdpr))}
                                    onRemove={(index) => {
                                      arrayHelpers.remove(formikBag.values.legalBases.filter(l => codelist.isArt6(l.gdpr)).length + index)
                                    }}
                                    onEdit={
                                      (index) => {
                                        setSelectedLegalBasis(formikBag.values.legalBases.filter(l => codelist.isArt9(l.gdpr))[index])
                                        setSelectedLegalBasisIndex(index)
                                        formikBag.setFieldValue('legalBasesOpen', true)
                                      }
                                    }
                                    sensitivityLevel={SensitivityLevel.ART9}
                                  />
                                </Block>
                              </Block>
                            </Block>
                          )}
                      </React.Fragment>
                    )}
                  />
                )}
              </ModalBody>
              <Error fieldName="legalBasesOpen" fullWidth={true} />

              <ModalFooter>
                <Block display="flex" justifyContent="flex-end">
                  <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                  <Button type="button" kind={KIND.minimal} onClick={onClose}>{intl.abort}</Button>
                  <ModalButton type="submit">{intl.save}</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )}
        />

      </Block>
    </Modal>

  )
}

export default ModalPolicy
