import React, { useEffect, useState } from 'react'
import { AddDocumentToProcessFormValues, DocumentInfoTypeUse, InformationType, Process } from '../../../constants'
import { getInformationTypesBy } from '../../../api'
import { Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE } from 'baseui/modal'
import { FieldArray, FieldArrayRenderProps, Form, Formik, FormikProps } from 'formik'
import { addBatchInfoTypesToProcessSchema } from '../../common/schema'
import { theme } from '../../../util'
import { Block, BlockProps } from 'baseui/block'
import { Error, ModalLabel } from '../../common/ModalSchema'
import { Select, Value } from 'baseui/select'
import { codelist, ListName } from '../../../service/Codelist'
import Button from '../../common/Button'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LabelMedium, LabelSmall } from 'baseui/typography'
import { lowerFirst } from 'lodash'
import { Sensitivity } from '../../InformationType/Sensitivity'
import { KIND } from 'baseui/button'
import { disableEnter } from '../../../util/helper-functions'

const modalBlockProps: BlockProps = {
  width: '750px',
  paddingRight: '2rem',
  paddingLeft: '2rem',
}

const rowBlockProps: BlockProps = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: '1rem',
}

type AddBatchInformationTypesProps = {
  isOpen: boolean
  submit: (values: AddDocumentToProcessFormValues) => void
  onClose: () => void
  process: Process
  error: string | null
}

export const AddBatchInformationTypesModal = (props: AddBatchInformationTypesProps) => {
  const [infoTypes, setInfoTypes] = useState<InformationType[]>([])
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [system, setSystem] = useState<Value>([])

  useEffect(() => {
    ;(async () => {
      if (!system.length) return
      setSearchLoading(true)
      const r = await getInformationTypesBy({ orgMaster: system[0].id as string })
      setInfoTypes(r.content)
      setSearchLoading(false)
    })()
  }, [system])

  const onCloseModal = () => {
    setSystem([])
    setInfoTypes([])
    props.onClose()
  }

  const mapToUse = (it: InformationType): DocumentInfoTypeUse => {
    const userCode = codelist.getCode(ListName.SUBJECT_CATEGORY, 'BRUKER')
    return {
      informationType: it,
      informationTypeId: it.id,
      subjectCategories: userCode ? [userCode] : [],
    }
  }

  return (
    <Modal onClose={onCloseModal} isOpen={props.isOpen} animate size={SIZE.auto} role={ROLE.dialog}>
      <Formik
        onSubmit={props.submit}
        initialValues={
          {
            informationTypes: [],
            process: props.process,
            linkDocumentToPolicies: false,
          } as AddDocumentToProcessFormValues
        }
        validationSchema={addBatchInfoTypesToProcessSchema(props.process.policies)}
        render={(formik: FormikProps<AddDocumentToProcessFormValues>) => {
          return (
            <Form onKeyDown={disableEnter}>
              <ModalHeader>Legg til en samling av opplysningstyper</ModalHeader>
              <ModalBody>
                <Block {...modalBlockProps}>
                  <Block {...rowBlockProps} flexDirection="row">
                    <ModalLabel label='Master i NAV' />
                    <Select
                      autoFocus
                      isLoading={searchLoading}
                      options={codelist.getParsedOptions(ListName.SYSTEM)}
                      maxDropdownHeight="400px"
                      value={system}
                      placeholder='System'
                      onChange={(params) => {
                        setSystem(params.value)
                      }}
                    />
                  </Block>
                </Block>

                <Block {...modalBlockProps} marginTop={theme.sizing.scale200}>
                  <FieldArray
                    name="informationTypes"
                    render={(informationTypesProps: FieldArrayRenderProps) => {
                      const addable = infoTypes.filter((it) => !formik.values.informationTypes.find((it2) => it2.informationTypeId === it.id))
                      const added = formik.values.informationTypes

                      return (
                        <>
                          {!!system.length && (
                            <>
                              {!!addable.length && (
                                <>
                                  <Block display="flex" flexDirection="column">
                                    <LabelMedium marginTop={theme.sizing.scale600}>Opplysningstyper ja</LabelMedium>
                                    <Block {...rowBlockProps}>
                                      {addable.map((it) => (
                                        <Block key={it.id} display="flex" alignItems="center" marginBottom={theme.sizing.scale100} marginTop={theme.sizing.scale100}>
                                          <LabelMedium>{it.name}</LabelMedium>
                                          <Button size="compact" kind="tertiary" shape="round" tooltip='Legg til' onClick={() => informationTypesProps.push(mapToUse(it))}>
                                            <FontAwesomeIcon icon={faPlusCircle} />
                                          </Button>
                                        </Block>
                                      ))}
                                    </Block>
                                  </Block>
                                </>
                              )}
                              {!addable.length && !infoTypes.length && (
                                <LabelMedium marginTop={theme.sizing.scale600}>
                                  Ingen opplysningstyper
                                </LabelMedium>
                              )}
                              {!addable.length && !!infoTypes.length && (
                                <LabelMedium marginTop={theme.sizing.scale600}>
                                  Alle opplysningstyper lagt til
                                </LabelMedium>
                              )}

                              <Block marginTop={theme.sizing.scale600} marginBottom={theme.sizing.scale600} width="100%" $style={{ borderBottom: '1px solid' }} />
                            </>
                          )}

                          <Block {...rowBlockProps}>
                            {added.map((it, idx) => (
                              <React.Fragment key={it.informationType.id}>
                                <Block display="flex" justifyContent="space-between" alignItems="center" marginBottom={theme.sizing.scale100} marginTop={theme.sizing.scale100}>
                                  <LabelMedium>
                                    <Sensitivity sensitivity={it.informationType.sensitivity} />
                                    &nbsp;
                                    {it.informationType.name}
                                  </LabelMedium>

                                  <Block width="60%" display="flex" alignItems="center">
                                    <LabelSmall marginRight={theme.sizing.scale100}>Personkategori: </LabelSmall>
                                    <Select
                                      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
                                      value={it.subjectCategories.map((sc) => ({ id: sc.code }))}
                                      onChange={(params) => {
                                        const subjectCategories = params.value.map((option) => ({ code: option.id }))
                                        informationTypesProps.replace(idx, { ...it, subjectCategories })
                                      }}
                                    />
                                    <Button marginLeft size="compact" kind="tertiary" shape="round" tooltip='Fjern' onClick={() => informationTypesProps.remove(idx)}>
                                      <FontAwesomeIcon icon={faMinusCircle} />
                                    </Button>
                                  </Block>
                                </Block>
                                <Block>
                                  {' '}
                                  <Error fieldName={`informationTypes[${idx}]`} />{' '}
                                </Block>
                                <Block>
                                  {' '}
                                  <Error fieldName={`informationTypes[${idx}].informationType`} />{' '}
                                </Block>
                                <Block>
                                  {' '}
                                  <Error fieldName={`informationTypes[${idx}].subjectCategories`} />{' '}
                                </Block>
                              </React.Fragment>
                            ))}
                          </Block>
                        </>
                      )
                    }}
                  />
                </Block>
              </ModalBody>
              <ModalFooter>
                <Block display="flex" justifyContent="flex-end">
                  <Block alignSelf="flex-end">{props.error && <p>{props.error}</p>}</Block>
                  <Button type="button" kind={KIND.tertiary} onClick={onCloseModal}>
                    Avbryt
                  </Button>
                  <ModalButton type="submit">Legg til</ModalButton>
                </Block>
              </ModalFooter>
            </Form>
          )
        }}
      />
    </Modal>
  )
}
