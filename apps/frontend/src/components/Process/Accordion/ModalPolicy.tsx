import { Select } from '@navikt/ds-react'
import { Button, KIND } from 'baseui/button'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { Radio, RadioGroup } from 'baseui/radio'
import { Tag, VARIANT } from 'baseui/tag'
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from 'formik'
import { Fragment, useEffect, useState } from 'react'
import { getInformationTypesShort } from '../../../api'
import { ELegalBasesUse, IInformationTypeShort, IPolicyFormValues } from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'
import { disableEnter } from '../../../util/helper-functions'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { policySchema } from '../../common/schema'
import FieldLegalBasis from '../common/FieldLegalBasis'
import { TDocs } from './TablePolicy'

const renderTagList = (list: string[], arrayHelpers: FieldArrayRenderProps) => (
  <Fragment>
    {list && list.length > 0
      ? list.map((item: string, index: number) => (
          <Fragment key={index}>
            {item ? (
              <Tag
                key={item}
                variant={VARIANT.outlined}
                onActionClick={() => arrayHelpers.remove(index)}
              >
                {item}
              </Tag>
            ) : null}
          </Fragment>
        ))
      : null}
  </Fragment>
)

const FieldInformationType = () => {
  const [infoTypes, setInfoTypes] = useState<IInformationTypeShort[]>([])
  const [selectedValue, setSelectedValue] = useState<string>('')

  useEffect(() => {
    getInformationTypesShort().then((informationTypeShort: IInformationTypeShort[]) => {
      setInfoTypes([...informationTypeShort].sort((a, b) => a.name.localeCompare(b.name)))
    })
  }, [])

  return (
    <Field
      name="informationType"
      render={({ form }: FieldProps<IPolicyFormValues>) => (
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
            <option value="">Søk opplysningsyper</option>
            {infoTypes.map((infoType: IInformationTypeShort) => (
              <option key={infoType.id} value={infoType.id}>
                {infoType.name}
              </option>
            ))}
          </Select>
        </>
      )}
    />
  )
}

const FieldLegalBasesUse = (props: { legalBasesUse: ELegalBasesUse }) => {
  const [value, setValue] = useState(props.legalBasesUse)

  return (
    <Field
      name="legalBasesUse"
      render={({ form }: FieldProps<IPolicyFormValues>) => (
        <div className="w-full">
          <RadioGroup
            value={value}
            align="vertical"
            error={!!form.errors.legalBasesUse && !!form.submitCount}
            onChange={(event) => {
              const selected: string = (event.target as HTMLInputElement).value
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
              <CustomizedStatefulTooltip
                content="Informasjon som er tilgjengelig i dokumenter eller systemet som brukes, uten at dette trengs eller brukes i behandlingen."
                text="Overskuddsinformasjon"
              />
            </Radio>
          </RadioGroup>
        </div>
      )}
    />
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
}: TModalPolicyProps) => (
  <Modal
    onClose={onClose}
    isOpen={isOpen}
    closeable={false}
    animate
    size={SIZE.auto}
    role={ROLE.dialog}
  >
    <div className="w-[750px] px-8">
      <Formik
        initialValues={initialValues}
        validationSchema={policySchema()}
        onSubmit={(values: IPolicyFormValues) => {
          submit(values)
          onClose()
        }}
      >
        {(formikBag: FormikProps<IPolicyFormValues>) => {
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
                          {codelist
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
                        {renderTagList(
                          codelist.getShortnames(
                            EListName.SUBJECT_CATEGORY,
                            formikBag.values.subjectCategories
                          ),
                          arrayHelpers
                        )}
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
                            formikBag.values.documentIds.map((id: string) => docs[id].name),
                            arrayHelpers
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

                {formikBag.values.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES && (
                  <FieldLegalBasis formikBag={formikBag} />
                )}
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
