import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { KIND } from 'baseui/button'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { OnChangeParams, Select, Value } from 'baseui/select'
import { LabelMedium, LabelSmall } from 'baseui/typography'
import { FieldArray, FieldArrayRenderProps, Form, Formik, FormikProps } from 'formik'
import { Fragment, useEffect, useState } from 'react'
import { getInformationTypesBy } from '../../../api'
import { AddDocumentToProcessFormValues, DocumentInfoTypeUse, InformationType, PageResponse, Process } from '../../../constants'
import { Code, ListName, codelist } from '../../../service/Codelist'
import { theme } from '../../../util'
import { disableEnter } from '../../../util/helper-functions'
import { Sensitivity } from '../../InformationType/Sensitivity'
import Button from '../../common/Button'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { addBatchInfoTypesToProcessSchema } from '../../common/schema'

type AddBatchInformationTypesProps = {
  isOpen: boolean
  submit: (values: AddDocumentToProcessFormValues) => void
  onClose: () => void
  process: Process
  error: string | null
}

export const AddBatchInformationTypesModal = (props: AddBatchInformationTypesProps) => {
  const { isOpen, submit, onClose, process, error } = props
  const [infoTypes, setInfoTypes] = useState<InformationType[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [system, setSystem] = useState<Value>([])

  useEffect(() => {
    ;(async () => {
      if (!system.length) return
      setSearchLoading(true)
      const response: PageResponse<InformationType> = await getInformationTypesBy({ orgMaster: system[0].id as string })
      setInfoTypes(response.content)
      setSearchLoading(false)
    })()
  }, [system])

  const onCloseModal = () => {
    setSystem([])
    setInfoTypes([])
    onClose()
  }

  const mapToUse = (informationType: InformationType): DocumentInfoTypeUse => {
    const userCode = codelist.getCode(ListName.SUBJECT_CATEGORY, 'BRUKER')

    return {
      informationType: informationType,
      informationTypeId: informationType.id,
      subjectCategories: userCode ? [userCode] : [],
    }
  }

  return (
    <Modal onClose={onCloseModal} isOpen={isOpen} animate size={SIZE.auto} role={ROLE.dialog}>
      <Formik
        onSubmit={submit}
        initialValues={
          {
            informationTypes: [],
            process: props.process,
            linkDocumentToPolicies: false,
          } as AddDocumentToProcessFormValues
        }
        validationSchema={addBatchInfoTypesToProcessSchema(process.policies)}
        render={(formik: FormikProps<AddDocumentToProcessFormValues>) => {
          return (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>Legg til en samling av opplysningstyper</ModalHeader>
              <ModalBody>
                <div className="w-[750px] px-8">
                  <div className=" flex w-full mt-4 flex-row">
                    <ModalLabel label="Master i NAV" />
                    <Select
                      autoFocus
                      isLoading={searchLoading}
                      options={codelist.getParsedOptions(ListName.SYSTEM)}
                      maxDropdownHeight="400px"
                      value={system}
                      placeholder="System"
                      onChange={(params: OnChangeParams) => {
                        setSystem(params.value)
                      }}
                    />
                  </div>
                </div>

                <div className="w-[750px] px-8 mt-1.5">
                  <FieldArray
                    name="informationTypes"
                    render={(informationTypesProps: FieldArrayRenderProps) => {
                      const addable = infoTypes.filter(
                        (infoType: InformationType) => !formik.values.informationTypes.find((it2: DocumentInfoTypeUse) => it2.informationTypeId === infoType.id),
                      )
                      const added: DocumentInfoTypeUse[] = formik.values.informationTypes

                      return (
                        <>
                          {!!system.length && (
                            <>
                              {!!addable.length && (
                                <>
                                  <div className="flex flex-col">
                                    <LabelMedium marginTop={theme.sizing.scale600}>Opplysningstyper ja</LabelMedium>
                                    <div className="flex flex-col w-full mt-4">
                                      {addable.map((informationType: InformationType) => (
                                        <div key={informationType.id} className="flex items-center my-1">
                                          <LabelMedium>{it.name}</LabelMedium>
                                          <Button
                                            size="compact"
                                            kind="tertiary"
                                            shape="round"
                                            tooltip="Legg til"
                                            onClick={() => informationTypesProps.push(mapToUse(informationType))}
                                          >
                                            <FontAwesomeIcon icon={faPlusCircle} />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                              {!addable.length && !infoTypes.length && <LabelMedium marginTop={theme.sizing.scale600}>Ingen opplysningstyper</LabelMedium>}
                              {!addable.length && !!infoTypes.length && <LabelMedium marginTop={theme.sizing.scale600}>Alle opplysningstyper lagt til</LabelMedium>}

                              <div className="my-4 w-full border-solid border-b-[1px]" />
                            </>
                          )}

                          <div className="flex flex-col w-full mt-4">
                            {added.map((informationTypeMap: DocumentInfoTypeUse, index: number) => (
                              <Fragment key={informationTypeMap.informationType.id}>
                                <div className="flex justify-between items-center my-1">
                                  <LabelMedium>
                                    <Sensitivity sensitivity={informationTypeMap.informationType.sensitivity} />
                                    &nbsp;
                                    {informationTypeMap.informationType.name}
                                  </LabelMedium>

                                  <div className="w-[60%] flex item-center">
                                    <LabelSmall marginRight={theme.sizing.scale100}>Personkategori: </LabelSmall>
                                    <Select
                                      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
                                      value={informationTypeMap.subjectCategories.map((subjectCategory: Code) => ({ id: subjectCategory.code }))}
                                      onChange={(params: OnChangeParams) => {
                                        const subjectCategories = params.value.map((option) => ({ code: option.id }))
                                        informationTypesProps.replace(index, { ...it, subjectCategories })
                                      }}
                                    />
                                    <Button marginLeft size="compact" kind="tertiary" shape="round" tooltip="Fjern" onClick={() => informationTypesProps.remove(index)}>
                                      <FontAwesomeIcon icon={faMinusCircle} />
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  {' '}
                                  <Error fieldName={`informationTypes[${index}]`} />{' '}
                                </div>
                                <div>
                                  {' '}
                                  <Error fieldName={`informationTypes[${index}].informationType`} />{' '}
                                </div>
                                <div>
                                  {' '}
                                  <Error fieldName={`informationTypes[${index}].subjectCategories`} />{' '}
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        </>
                      )
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end">
                  <div className="self-end">{error && <p>{error}</p>}</div>
                  <Button type="button" kind={KIND.tertiary} onClick={onCloseModal}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Legg til</ModalButton>
                </div>
              </ModalFooter>
            </Form>
          )
        }}
      />
    </Modal>
  )
}
