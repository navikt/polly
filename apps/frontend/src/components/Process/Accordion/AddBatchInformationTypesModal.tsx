import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BodyShort, Modal, Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, Form, Formik, FormikProps } from 'formik'
import { Fragment, useEffect, useState } from 'react'
import { getInformationTypesBy } from '../../../api/GetAllApi'
import {
  IAddDocumentToProcessFormValues,
  IDocumentInfoTypeUse,
  IInformationType,
  IPageResponse,
  IProcess,
} from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { disableEnter } from '../../../util/helper-functions'
import { Sensitivity } from '../../InformationType/Sensitivity'
import Button from '../../common/Button/CustomButton'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { addBatchInfoTypesToProcessSchema } from '../../common/schemaValidation'

type TAddBatchInformationTypesProps = {
  isOpen: boolean
  submit: (values: IAddDocumentToProcessFormValues) => void
  onClose: () => void
  process: IProcess
  error: string | null
  codelistUtils: ICodelistProps
}

export const AddBatchInformationTypesModal = (props: TAddBatchInformationTypesProps) => {
  const { isOpen, submit, onClose, process, error, codelistUtils } = props

  const [infoTypes, setInfoTypes] = useState<IInformationType[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [system, setSystem] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      if (!system) return
      setSearchLoading(true)
      const response: IPageResponse<IInformationType> = await getInformationTypesBy({
        orgMaster: system,
      })
      setInfoTypes(response.content)
      setSearchLoading(false)
    })()
  }, [system])

  const onCloseModal = () => {
    setSystem('')
    setInfoTypes([])
    onClose()
  }

  const mapToUse = (informationType: IInformationType): IDocumentInfoTypeUse => {
    const userCode: ICode | undefined = codelistUtils.getCode(EListName.SUBJECT_CATEGORY, 'BRUKER')

    return {
      informationType: informationType,
      informationTypeId: informationType.id,
      subjectCategories: userCode ? [userCode] : [],
    }
  }

  return (
    <Modal
      onClose={onCloseModal}
      open={isOpen}
      header={{ heading: 'Legg til en samling av opplysningstyper' }}
      width="750px"
    >
      <Formik
        onSubmit={submit}
        initialValues={
          {
            informationTypes: [],
            process: props.process,
            linkDocumentToPolicies: false,
          } as IAddDocumentToProcessFormValues
        }
        validationSchema={addBatchInfoTypesToProcessSchema(
          process.policies,
          codelistUtils.getCodes(EListName.SUBJECT_CATEGORY)
        )}
        render={(formik: FormikProps<IAddDocumentToProcessFormValues>) => {
          return (
            <Form onKeyDown={disableEnter}>
              <Modal.Body>
                <div className="w-[750px] px-8">
                  <div className=" flex w-full mt-4 flex-row">
                    <ModalLabel label="Master i NAV" />
                    <Select
                      label="Master i NAV"
                      hideLabel
                      value={system}
                      onChange={(event) => {
                        setSystem(event.target.value)
                      }}
                    >
                      <option value="">Velg system</option>
                      {codelistUtils.getParsedOptions(EListName.SYSTEM).map((system) => (
                        <option value={system.id} key={system.id}>
                          {system.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {!searchLoading && (
                  <div className="w-[750px] px-8 mt-1.5">
                    <FieldArray
                      name="informationTypes"
                      render={(informationTypesProps: FieldArrayRenderProps) => {
                        const addable = infoTypes.filter(
                          (infoType: IInformationType) =>
                            !formik.values.informationTypes.find(
                              (it2: IDocumentInfoTypeUse) => it2.informationTypeId === infoType.id
                            )
                        )
                        const added: IDocumentInfoTypeUse[] = formik.values.informationTypes

                        return (
                          <>
                            {!!system && (
                              <>
                                {!!addable.length && (
                                  <>
                                    <div className="flex flex-col">
                                      <BodyShort className="mt-4">Opplysningstyper</BodyShort>
                                      <div className="flex flex-col w-full mt-4">
                                        {addable.map((informationType: IInformationType) => (
                                          <div
                                            key={informationType.id}
                                            className="flex items-center my-1"
                                          >
                                            <BodyShort className="mr-2">
                                              {informationType.name}
                                            </BodyShort>
                                            <Button
                                              size="xsmall"
                                              kind="tertiary"
                                              tooltip="Legg til"
                                              onClick={() =>
                                                informationTypesProps.push(
                                                  mapToUse(informationType)
                                                )
                                              }
                                            >
                                              <FontAwesomeIcon icon={faPlusCircle} />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                )}
                                {!addable.length && !infoTypes.length && (
                                  <BodyShort className="mt-4">Ingen opplysningstyper</BodyShort>
                                )}
                                {!addable.length && !!infoTypes.length && (
                                  <BodyShort className="mt-4">
                                    Alle opplysningstyper lagt til
                                  </BodyShort>
                                )}

                                <div className="my-4 w-full border-solid border-b-[1px]" />
                              </>
                            )}

                            <div className="flex flex-col w-full mt-4">
                              {added.map(
                                (informationTypeMap: IDocumentInfoTypeUse, index: number) => (
                                  <Fragment key={informationTypeMap.informationType.id}>
                                    <div className="flex justify-between items-center my-1">
                                      <BodyShort>
                                        <Sensitivity
                                          sensitivity={
                                            informationTypeMap.informationType.sensitivity
                                          }
                                          codelistUtils={codelistUtils}
                                        />
                                        &nbsp;
                                        {informationTypeMap.informationType.name}
                                      </BodyShort>

                                      <div className="w-[60%] flex item-center">
                                        <BodyShort className="mr-2">Personkategori:</BodyShort>
                                        <Select
                                          label="velg personkategori"
                                          hideLabel
                                          onChange={(event) => {
                                            informationTypesProps.replace(index, {
                                              ...informationTypeMap,
                                              subjectCategories: [{ code: event.target.value }],
                                            })
                                          }}
                                        >
                                          <option value="">Velg personkategori</option>
                                          {codelistUtils
                                            .getParsedOptions(EListName.SUBJECT_CATEGORY)
                                            .map((personkategori, index) => (
                                              <option
                                                key={'batchAdd_' + index + '_' + personkategori.id}
                                                value={personkategori.id}
                                              >
                                                {personkategori.label}
                                              </option>
                                            ))}
                                        </Select>
                                        <Button
                                          marginLeft
                                          size="xsmall"
                                          kind="tertiary"
                                          tooltip="Fjern"
                                          onClick={() => informationTypesProps.remove(index)}
                                        >
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
                                      <Error
                                        fieldName={`informationTypes[${index}].informationType`}
                                      />{' '}
                                    </div>
                                    <div>
                                      {' '}
                                      <Error
                                        fieldName={`informationTypes[${index}].subjectCategories`}
                                      />{' '}
                                    </div>
                                  </Fragment>
                                )
                              )}
                            </div>
                          </>
                        )
                      }}
                    />
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <div className="flex justify-end">
                  <div className="self-end">{error && <p>{error}</p>}</div>
                  <Button type="button" kind="tertiary" onClick={onCloseModal}>
                    Avbryt
                  </Button>
                  <Button type="submit">Legg til</Button>
                </div>
              </Modal.Footer>
            </Form>
          )
        }}
      />
    </Modal>
  )
}
