import { DocPencilIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, Modal, Tooltip } from '@navikt/ds-react'
import _ from 'lodash'
import { Fragment, useEffect, useState } from 'react'
import { getAlertForProcess } from '../../../api/AlertApi'
import { convertPolicyToFormValues, getDocument } from '../../../api/GetAllApi'
import {
  IDocument,
  IPolicy,
  IPolicyFormValues,
  IProcess,
  IProcessAlert,
  getPolicySort,
} from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { theme } from '../../../util'
import { useTable } from '../../../util/hooks'
import { Sensitivity } from '../../InformationType/Sensitivity'
import { AuditButton } from '../../admin/audit/AuditButton'
import { LegalBasesNotClarified, ListLegalBasesInTable } from '../../common/LegalBasis'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'
import ModalPolicy from './ModalPolicy'

type TTablePurposeProps = {
  codelistUtils: ICodelistProps
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
  codelistUtils,
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
    sorting: getPolicySort(codelistUtils),
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
      const allIds = _.uniq(process.policies.flatMap((p) => p.documentIds)).filter(
        (id) => id !== undefined
      )
      const docMap: TDocs = (await Promise.all(allIds.map((id) => getDocument(id)))).reduce(
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
              $style={{ width: '45%' }}
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
                <div className="w-full min-w-0">
                  <div className="min-w-0">
                    <Sensitivity
                      sensitivity={row.informationType.sensitivity}
                      codelistUtils={codelistUtils}
                    />
                    &nbsp;
                    <RouteLink
                      href={`/informationtype/${row.informationType.id}`}
                      className="block break-words whitespace-normal"
                    >
                      {row.informationType.name}
                    </RouteLink>
                    {!!row.documentIds?.length && (
                      <Tooltip content="Dokument">
                        <span className="block opacity-80 break-words whitespace-normal mt-1">
                          {'(' +
                            row.documentIds?.map((id) => (docs[id] || {}).name).join(', ') +
                            ')'}
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </Cell>

              <Cell>
                {row.subjectCategories
                  .map((subjectCategory: ICode) =>
                    codelistUtils.getShortname(EListName.SUBJECT_CATEGORY, subjectCategory.code)
                  )
                  .join(', ')}
              </Cell>
              <Cell>
                <div>
                  <LegalBasesNotClarified
                    alert={alert?.policies.filter((policy) => policy.policyId === row.id)[0]}
                  />

                  {row.legalBases && row.legalBases.length > 0 && (
                    <ListLegalBasesInTable
                      legalBases={row.legalBases}
                      codelistUtils={codelistUtils}
                    />
                  )}
                </div>
              </Cell>
              <Cell small>
                <div className="flex justify-end w-full items-center">
                  <AuditButton id={row.id} kind="tertiary" />
                  {hasAccess && (
                    <>
                      <Tooltip content="Redigér">
                        <Button
                          variant="tertiary"
                          aria-label="Redigér"
                          onClick={() => {
                            setCurrentPolicy(row)
                            setShowEditModal(true)
                          }}
                        >
                          <DocPencilIcon aria-hidden className="block" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Slett">
                        <Button
                          variant="tertiary"
                          aria-label="Slett"
                          onClick={() => {
                            setCurrentPolicy(row)
                            setShowDeleteModal(true)
                          }}
                        >
                          <TrashIcon aria-hidden className="block" />
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
          codelistUtils={codelistUtils}
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
