import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, SIZE as ButtonSize, KIND } from 'baseui/button'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import * as React from 'react'
import { useEffect, useState } from 'react'

import _ from 'lodash'
import { convertPolicyToFormValues, getDocument } from '../../../api'
import { getAlertForProcess } from '../../../api/AlertApi'
import { Document, Policy, PolicyFormValues, policySort, Process, ProcessAlert } from '../../../constants'
import { codelist, ListName } from '../../../service/Codelist'
import { theme } from '../../../util'
import { useTable } from '../../../util/hooks'
import { AuditButton } from '../../audit/AuditButton'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'
import { LegalBasesNotClarified, ListLegalBasesInTable } from '../../common/LegalBasis'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'
import { Sensitivity } from '../../InformationType/Sensitivity'
import ModalPolicy from './ModalPolicy'

type TablePurposeProps = {
  process: Process
  hasAccess: boolean
  errorPolicyModal: string | null
  errorDeleteModal: string | null
  submitEditPolicy: (policy: PolicyFormValues) => Promise<boolean>
  submitDeletePolicy: (policy: Policy) => Promise<boolean>
}

export type Docs = {
  [id: string]: Document
}

const TablePolicy = ({ process, hasAccess, errorPolicyModal, errorDeleteModal, submitEditPolicy, submitDeletePolicy }: TablePurposeProps) => {
  const [currentPolicy, setCurrentPolicy] = React.useState<Policy>()
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [table, sortColumn] = useTable<Policy, keyof Policy>(process.policies, { sorting: policySort, initialSortColumn: 'informationType' })
  const [alert, setAlert] = useState<ProcessAlert>()

  useEffect(() => {
    ;(async () => {
      setAlert(await getAlertForProcess(process.id))
    })()
  }, [process])

  const [docs, setDocs] = useState<Docs>({})

  useEffect(() => {
    ;(async () => {
      const allIds = _.uniq(process.policies.flatMap((p) => p.documentIds)).filter((id) => !!id)
      const docMap = (await Promise.all(allIds.map((id) => getDocument(id!)))).reduce((acc: Docs, doc) => {
        acc[doc.id] = doc
        return acc
      }, {} as Docs)

      setDocs(docMap)
    })()
  }, [process])

  return (
    <React.Fragment>
      <Table
        emptyText={process.usesAllInformationTypes ? 'Bruker potensielt alle opplysningstyper' : 'Ingen opplysningstyper'}
        backgroundColor={theme.colors.primary100}
        headers={
          <>
            <HeadCell title="Opplysningstype" column={'informationType'} tableState={[table, sortColumn]} />
            <HeadCell title="Personkategori" column={'subjectCategories'} tableState={[table, sortColumn]} />
            <HeadCell title="Behandlingsgrunnlag" column={'legalBases'} tableState={[table, sortColumn]} />
            <HeadCell small />
          </>
        }
      >
        {table.data.map((row: Policy, index: number) => {
          return (
            <React.Fragment key={index}>
              <Row>
                <Cell>
                  <div className="flex w-full justify-between">
                    <div>
                      <Sensitivity sensitivity={row.informationType.sensitivity} />
                      &nbsp;
                      <RouteLink href={`/informationtype/${row.informationType.id}`} width="25%">
                        {row.informationType.name}
                      </RouteLink>
                    </div>
                    <div>
                      <CustomizedStatefulTooltip content={() => 'Dokument'}>
                        <div className="opacity-80">{!!row.documentIds?.length && '(' + row.documentIds?.map((id) => (docs[id] || {}).name).join(', ') + ')'}</div>
                      </CustomizedStatefulTooltip>
                    </div>
                  </div>
                </Cell>

                <Cell>{row.subjectCategories.map((sc) => codelist.getShortname(ListName.SUBJECT_CATEGORY, sc.code)).join(', ')}</Cell>
                <Cell>
                  <div>
                    <LegalBasesNotClarified alert={alert?.policies.filter((p) => p.policyId === row.id)[0]} />

                    {row.legalBases && row.legalBases.length > 0 && <ListLegalBasesInTable legalBases={row.legalBases} />}
                  </div>
                </Cell>
                <Cell small>
                  <div className="flex justify-end w-full">
                    <AuditButton id={row.id} kind="tertiary" />
                    {hasAccess && (
                      <>
                        <CustomizedStatefulTooltip content="Redigér">
                          <Button
                            size={ButtonSize.compact}
                            kind={KIND.tertiary}
                            onClick={() => {
                              setCurrentPolicy(row)
                              setShowEditModal(true)
                            }}
                          >
                            <FontAwesomeIcon title="Redigér" icon={faEdit} />
                          </Button>
                        </CustomizedStatefulTooltip>
                        <CustomizedStatefulTooltip content="Slett">
                          <Button
                            size={ButtonSize.compact}
                            kind={KIND.tertiary}
                            onClick={() => {
                              setCurrentPolicy(row)
                              setShowDeleteModal(true)
                            }}
                          >
                            <FontAwesomeIcon title="Slett" icon={faTrash} />
                          </Button>
                        </CustomizedStatefulTooltip>
                      </>
                    )}
                  </div>
                </Cell>
              </Row>
            </React.Fragment>
          )
        })}
      </Table>

      {showEditModal && currentPolicy && (
        <ModalPolicy
          title="Rediger behandling for opplysningstype"
          initialValues={convertPolicyToFormValues(
            currentPolicy,
            process.policies.filter((p) => p.id !== currentPolicy.id),
          )}
          docs={docs}
          onClose={() => {
            setShowEditModal(false)
          }}
          isOpen={showEditModal}
          isEdit={true}
          submit={submitEditPolicy}
          errorOnCreate={errorPolicyModal}
        />
      )}

      {showDeleteModal && currentPolicy && (
        <Modal onClose={() => setShowDeleteModal(false)} isOpen={showDeleteModal} animate size="default">
          <ModalHeader>Bekreft sletting</ModalHeader>
          <ModalBody>
            <ParagraphMedium>Bekreft sletting av opplysningstypen {currentPolicy.informationType.name} for denne behandlingen</ParagraphMedium>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end">
              <div className="self-end">{errorDeleteModal && <p>{errorDeleteModal}</p>}</div>
              <Button kind="secondary" onClick={() => setShowDeleteModal(false)} overrides={{ BaseButton: { style: { marginRight: '1rem', marginLeft: '1rem' } } }}>
                Avbryt
              </Button>
              <Button
                onClick={() => {
                  submitDeletePolicy(currentPolicy)
                    .then(() => setShowDeleteModal(false))
                    .catch(() => setShowDeleteModal(true))
                }}
              >
                Slett
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </React.Fragment>
  )
}

export default TablePolicy
