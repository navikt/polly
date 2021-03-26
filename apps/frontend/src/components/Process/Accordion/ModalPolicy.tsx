import * as React from 'react'
import {KeyboardEvent, useEffect, useState} from 'react'
import {Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE} from 'baseui/modal'
import {Field, FieldArray, FieldArrayRenderProps, FieldProps, Form, Formik, FormikProps,} from 'formik'
import {Block, BlockProps} from 'baseui/block'
import {Radio, RadioGroup} from 'baseui/radio'
import {Select, StatefulSelect} from 'baseui/select'
import {codelist, ListName} from '../../../service/Codelist'
import {Button, KIND} from 'baseui/button'
import {InformationTypeShort, LegalBasesUse, PolicyFormValues} from '../../../constants'
import {getInformationTypesShort} from '../../../api'
import {Error, ModalLabel} from '../../common/ModalSchema'
import {intl} from '../../../util'
import {policySchema} from '../../common/schema'
import {Tag, VARIANT} from 'baseui/tag'
import {Docs} from './TablePolicy'
import FieldLegalBasis from "../common/FieldLegalBasis";
import CustomizedStatefulTooltip from "../../common/CustomizedStatefulTooltip";
import {KIND as NKIND, Notification} from 'baseui/notification'
import {paddingZero} from '../../common/Style'


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
  const [infoTypes, setInfoTypes] = useState<InformationTypeShort[]>([])

  useEffect(() => {
    getInformationTypesShort().then(its => {
      setInfoTypes([...its].sort((a, b) => a.name.localeCompare(b.name)))
    })
  }, [])

  return (
    <Field
      name="informationType"
      render={({form}: FieldProps<PolicyFormValues>) => (
        <StatefulSelect
          maxDropdownHeight="400px"
          noResultsMsg={intl.emptyTable}
          options={infoTypes}
          placeholder={form.values.informationType ? '' : intl.informationTypeSearch}
          initialState={{value: form.values.informationType}}
          onChange={params => form.setFieldValue('informationType', params.value[0] as InformationTypeShort)}
          error={!!form.errors.informationType && !!form.submitCount}
          labelKey="name"
        />
      )}
    />
  )
}

const FieldLegalBasesUse = (props: {legalBasesUse: LegalBasesUse}) => {
  const [value, setValue] = useState(props.legalBasesUse)
  return (
    <Field
      name="legalBasesUse"
      render={({form}: FieldProps<PolicyFormValues>) => {
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
              <Radio value={LegalBasesUse.EXCESS_INFO}>
                <CustomizedStatefulTooltip content={intl.excessInfoHelpText}>{intl.EXCESS_INFO}</CustomizedStatefulTooltip>
              </Radio>
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
  addBatch?: () => void
};

const ModalPolicy = ({submit, errorOnCreate, onClose, isOpen, initialValues, docs, title, addBatch}: ModalPolicyProps) => {

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
            //workaround for not functioning subjectCategories validation in yup
            if (!!values.subjectCategories.length)
              submit(values)
          }}
          render={(formikBag: FormikProps<PolicyFormValues>) => {
            let subjectCatError = (!!formikBag.errors.subjectCategories || !formikBag.values.subjectCategories.length) && !!formikBag.touched.subjectCategories
            return (
              <Form onKeyDown={disableEnter}>
                <ModalHeader>
                  <Block display="flex" justifyContent="space-around" marginBottom="2rem">
                    {title}
                    {addBatch && <Button type="button" kind="secondary" size="compact"
                                         onClick={addBatch}>{intl.addManyFromSystem}</Button>}
                  </Block>
                </ModalHeader>

                <ModalBody>
                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.informationType}/>
                    <FieldInformationType/>
                  </Block>
                  <Error fieldName="informationType"/>

                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.subjectCategories}/>
                    <FieldArray
                      name="subjectCategories"
                      render={arrayHelpers =>
                        (
                          <Block width="100%">
                            <Select
                              options={codelist.getParsedOptionsFilterOutSelected(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories)}
                              maxDropdownHeight="300px"
                              onChange={({option}) => {
                                arrayHelpers.push(option ? option.id : null)
                              }}
                              error={subjectCatError}
                            />
                            {renderTagList(codelist.getShortnames(ListName.SUBJECT_CATEGORY, formikBag.values.subjectCategories), arrayHelpers)}
                          </Block>
                        )}
                    />
                  </Block>
                  <Error fieldName="subjectCategories"/>

                  {/*workaround for not functioning subjectCategories validation in yup */}
                  <Block display={subjectCatError ? 'flex' : 'none'} width="100%" marginTop=".2rem">
                    <ModalLabel/>
                    <Block width="100%">
                      <Notification overrides={{Body: {style: {width: 'auto', ...paddingZero, marginTop: 0}}}}
                                    kind={NKIND.negative}>{intl.required}</Notification>
                    </Block>
                  </Block>

                  {!!formikBag.values.documentIds?.length && docs &&
                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.documents}/>
                    <FieldArray name="documentIds"
                                render={arrayHelpers => (
                                  <Block width='100%'>{renderTagList(formikBag.values.documentIds.map(id => docs[id].name), arrayHelpers)}</Block>
                                )}/>
                  </Block>
                  }

                  <Block {...rowBlockProps}>
                    <ModalLabel label={intl.legalBasesShort}/>
                    <FieldLegalBasesUse legalBasesUse={formikBag.values.legalBasesUse}/>
                  </Block>
                  <Error fieldName="legalBasesUse"/>

                  {formikBag.values.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && (
                    <FieldLegalBasis formikBag={formikBag}/>
                  )}
                </ModalBody>
                <Error fieldName="legalBasesOpen" fullWidth={true}/>

                <ModalFooter>
                  <Block display="flex" justifyContent="flex-end">
                    <Block alignSelf="flex-end">{errorOnCreate && <p>{errorOnCreate}</p>}</Block>
                    <Button type="button" kind={KIND.minimal} onClick={onClose}>{intl.abort}</Button>
                    <ModalButton type="submit">{intl.save}</ModalButton>
                  </Block>
                </ModalFooter>
              </Form>
            )
          }}
        />

      </Block>
    </Modal>

  )
}

export default ModalPolicy
