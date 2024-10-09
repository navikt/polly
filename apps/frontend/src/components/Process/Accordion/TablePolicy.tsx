import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Tooltip } from '@navikt/ds-react'
import _ from 'lodash'
import { Fragment, useEffect, useState } from 'react'
import { convertPolicyToFormValues, getDocument } from '../../../api'
import { getAlertForProcess } from '../../../api/AlertApi'
import {
  IDocument,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessAlert,
  policySort,
} from '../../../constants'
import { EListName, codelist } from '../../../service/Codelist'
import { theme } from '../../../util'
import { useTable } from '../../../util/hooks'
import { Sensitivity } from '../../InformationType/Sensitivity'
import { AuditButton } from '../../admin/audit/AuditButton'
import { LegalBasesNotClarified, ListLegalBasesInTable } from '../../common/LegalBasis'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'
import ModalPolicy from './ModalPolicy'

type TTablePurposeProps = {
  process: IProcess
  hasAccess: boolean
  errorPolicyModal: string | null
  errorDeleteModal: string | null
  submitEditPolicy: (policy: IPolicyFormValues) => Promise<boolean>
  submitDeletePolicy: (policy: IPolicy) => Promise<boolean>
}

export type TDocs = {
  [id: string]: IDocument
}

const TablePolicy = ({
  process,
  hasAccess,
  errorPolicyModal,
  errorDeleteModal,
  submitEditPolicy,
  submitDeletePolicy,
}: TTablePurposeProps) => {
  const [currentPolicy, setCurrentPolicy] = useState<IPolicy>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [table, sortColumn] = useTable<IPolicy, keyof IPolicy>(process.policies, {
    sorting: policySort,
    initialSortColumn: 'informationType',
  })
  const [alert, setAlert] = useState<IProcessAlert>()

  useEffect(() => {
    ;(async () => {
      setAlert(await getAlertForProcess(process.id))
    })()
  }, [process])

  const [docs, setDocs] = useState<TDocs>({})

  useEffect(() => {
    ;(async () => {
      const allIds = _.uniq(process.policies.flatMap((p) => p.documentIds)).filter((id) => !!id)
      const docMap: TDocs = (await Promise.all(allIds.map((id) => getDocument(id!)))).reduce(
        (acc: TDocs, doc) => {
          acc[doc.id] = doc
          return acc
        },
        {} as TDocs
      )

      setDocs(docMap)
    })()
  }, [process])

  return (
    <Fragment>
      <Table
        emptyText={
          process.usesAllInformationTypes
            ? 'Bruker potensielt alle opplysningstyper'
            : 'Ingen opplysningstyper'
        }
        backgroundColor={theme.colors.primary100}
        headers={
          <>
            <HeadCell
              title="Opplysningstype"
              column={'informationType'}
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title="Personkategori"
              column={'subjectCategories'}
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title="Behandlingsgrunnlag"
              column={'legalBases'}
              tableState={[table, sortColumn]}
            />
            <HeadCell small />
          </>
        }
      >
        {table.data.map((row: IPolicy, index: number) => (
          <Fragment key={index}>
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
                    <Tooltip content="Dokument">
                      <div className="opacity-80">
                        {!!row.documentIds?.length &&
                          '(' +
                            row.documentIds?.map((id) => (docs[id] || {}).name).join(', ') +
                            ')'}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Cell>

              <Cell>
                {row.subjectCategories
                  .map((subjectCategory) =>
                    codelist.getShortname(EListName.SUBJECT_CATEGORY, subjectCategory.code)
                  )
                  .join(', ')}
              </Cell>
              <Cell>
                <div>
                  <LegalBasesNotClarified
                    alert={alert?.policies.filter((policy) => policy.policyId === row.id)[0]}
                  />

                  {row.legalBases && row.legalBases.length > 0 && (
                    <ListLegalBasesInTable legalBases={row.legalBases} />
                  )}
                </div>
              </Cell>
              <Cell small>
                <div className="flex justify-end w-full">
                  <AuditButton id={row.id} kind="tertiary" />
                  {hasAccess && (
                    <>
                      <Tooltip content="Redigér">
                        <Button
                          variant="tertiary"
                          onClick={() => {
                            setCurrentPolicy(row)
                            setShowEditModal(true)
                          }}
                        >
                          <FontAwesomeIcon title="Redigér" icon={faEdit} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Slett">
                        <Button
                          variant="tertiary"
                          onClick={() => {
                            setCurrentPolicy(row)
                            setShowDeleteModal(true)
                          }}
                        >
                          <FontAwesomeIcon title="Slett" icon={faTrash} />
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </Cell>
            </Row>
          </Fragment>
        ))}
      </Table>

      {showEditModal && currentPolicy && (
        <ModalPolicy
          title="Rediger behandling for opplysningstype"
          initialValues={convertPolicyToFormValues(
            currentPolicy,
            process.policies.filter((policy) => policy.id !== currentPolicy.id)
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
        <Modal
          onClose={() => setShowDeleteModal(false)}
          open={showDeleteModal}
          header={{ heading: 'Bekreft sletting' }}
        >
          <Modal.Body>
            Bekreft sletting av opplysningstypen {currentPolicy.informationType.name} for denne
            behandlingen
          </Modal.Body>

          <Modal.Footer>
            <div className="flex justify-end">
              <div className="self-end">{errorDeleteModal && <p>{errorDeleteModal}</p>}</div>
              <Button
                className="mr-4"
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
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
          </Modal.Footer>
        </Modal>
      )}
    </Fragment>
  )
}

export default TablePolicy
