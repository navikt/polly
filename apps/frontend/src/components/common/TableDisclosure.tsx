import { faEdit, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { KIND } from 'baseui/button'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Fragment, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { convertDisclosureToFormValues } from '../../api/GetAllApi'
import {
  IDisclosure,
  IDisclosureAlert,
  IDisclosureFormValues,
  disclosureSort,
} from '../../constants'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { ICodelistProps } from '../../service/Codelist'
import { useTable } from '../../util/hooks'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'
import Button from './Button/CustomButton'
import { ListLegalBasesInTable } from './LegalBasis'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TTableDisclosureProps = {
  list: Array<IDisclosure>
  showRecipient: boolean
  editable: boolean
  submitDeleteDisclosure?: (disclosure: IDisclosure) => Promise<boolean>
  submitEditDisclosure?: (disclosure: IDisclosureFormValues) => Promise<boolean>
  errorModal?: string
  onCloseModal?: () => void
  codelistUtils: ICodelistProps
}

type TAlerts = { [k: string]: IDisclosureAlert }
const TableDisclosure = ({
  list,
  showRecipient,
  submitDeleteDisclosure,
  submitEditDisclosure,
  errorModal,
  editable,
  onCloseModal,
  codelistUtils,
}: TTableDisclosureProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>()
  const [selectedDisclosure, setSelectedDisclosure] = useState<IDisclosure>()
  const [alerts, setAlerts] = useState<TAlerts>({})

  const [table, sortColumn] = useTable<IDisclosure, keyof IDisclosure>(list, {
    sorting: disclosureSort,
    initialSortColumn: showRecipient ? 'recipient' : 'name',
  })

  useEffect(() => {
    ;(async () => {
      const alertMap: TAlerts = (
        await Promise.all(list.map((list: IDisclosure) => getAlertForDisclosure(list.id)))
      ).reduce((acc: TAlerts, alert: IDisclosureAlert) => {
        acc[alert.disclosureId] = alert
        return acc
      }, {} as TAlerts)
      setAlerts(alertMap)
    })()
  }, [list])

  return (
    <Fragment>
      <Table
        emptyText="Ingen utlevering"
        headers={
          <>
            {showRecipient && (
              <HeadCell title="Mottaker" column="recipient" tableState={[table, sortColumn]} />
            )}
            <HeadCell title="Navn på utlevering" column="name" tableState={[table, sortColumn]} />
            <HeadCell title="Dokument" column="document" tableState={[table, sortColumn]} />
            <HeadCell
              title="Formål med utlevering"
              column="recipientPurpose"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title="Ytterligere beskrivelse"
              column="description"
              tableState={[table, sortColumn]}
            />
            <HeadCell
              title="Behandlingsgrunnlag"
              column="legalBases"
              tableState={[table, sortColumn]}
            />
            <HeadCell small />
          </>
        }
      >
        {table.data.map((row: IDisclosure, index: number) => (
          <DisclosureRow
            codelistUtils={codelistUtils}
            key={index}
            disclosure={row}
            editable={editable}
            showRecipient={showRecipient}
            alert={alerts[row.id]}
            setSelectedDisclosure={setSelectedDisclosure}
            showEditModal={() => setShowEditModal(true)}
            showDeleteModal={() => setShowDeleteModal(true)}
          />
        ))}
      </Table>

      {editable && showEditModal && selectedDisclosure && (
        <ModalThirdParty
          title="Rediger utlevering"
          isOpen={showEditModal}
          initialValues={convertDisclosureToFormValues(selectedDisclosure)}
          submit={async (values: IDisclosureFormValues) =>
            submitEditDisclosure && (await submitEditDisclosure(values))
              ? setShowEditModal(false)
              : setShowEditModal(true)
          }
          onClose={() => {
            if (onCloseModal) {
              onCloseModal()
            }
            setShowEditModal(false)
          }}
          errorOnCreate={errorModal}
          disableRecipientField={true}
        />
      )}

      {showDeleteModal && (
        <Modal
          onClose={() => setShowDeleteModal(false)}
          isOpen={showDeleteModal}
          animate
          size="default"
        >
          <ModalHeader>Bekreft sletting</ModalHeader>
          <ModalBody>
            <ParagraphMedium>
              Bekreft sletting av behandling for opplysningstypen{' '}
              {selectedDisclosure && selectedDisclosure.recipient.code}
            </ParagraphMedium>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end">
              <div className="self-end">{errorModal && <p>{errorModal}</p>}</div>
              <Button
                kind="secondary"
                onClick={() => setShowDeleteModal(false)}
                marginLeft
                marginRight
              >
                Avbryt
              </Button>
              <Button
                onClick={() => {
                  if (selectedDisclosure && submitDeleteDisclosure) {
                    submitDeleteDisclosure(selectedDisclosure).then((result: boolean) => {
                      if (result) {
                        setShowDeleteModal(false)
                      } else {
                        setShowDeleteModal(true)
                      }
                    })
                  }
                }}
              >
                Slett
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </Fragment>
  )
}

interface IDisclosureRowProps {
  disclosure: IDisclosure
  editable: boolean
  showRecipient: boolean
  alert: IDisclosureAlert
  setSelectedDisclosure: (disclosure: IDisclosure) => void
  showEditModal: () => void
  showDeleteModal: () => void
  codelistUtils: ICodelistProps
}

const DisclosureRow = (props: IDisclosureRowProps) => {
  const {
    disclosure,
    editable,
    alert,
    showRecipient,
    setSelectedDisclosure,
    showEditModal,
    showDeleteModal,
    codelistUtils,
  } = props
  const navigate: NavigateFunction = useNavigate()
  const hasAlert: boolean = alert?.missingArt6

  return (
    <Row>
      {showRecipient && (
        <Cell>
          <RouteLink href={`/thirdparty/${disclosure.recipient.code}`}>
            {disclosure.recipient.shortName}
          </RouteLink>
        </Cell>
      )}
      <Cell>{disclosure.name}</Cell>
      <Cell>
        {
          <RouteLink href={`/document/${disclosure.documentId}`}>
            {disclosure.document?.name}
          </RouteLink>
        }
      </Cell>
      <Cell>{disclosure.recipientPurpose}</Cell>
      <Cell>{disclosure.description}</Cell>
      <Cell>
        {disclosure.legalBases && (
          <ListLegalBasesInTable legalBases={disclosure.legalBases} codelistUtils={codelistUtils} />
        )}
      </Cell>
      <Cell small>
        {hasAlert && canViewAlerts() && (
          <Button
            type="button"
            kind="tertiary"
            size="xsmall"
            icon={faExclamationCircle}
            tooltip={
              hasAlert ? `Varsler: Behandlingsgrunnlag for artikkel 6 mangler` : `Varsler: Nei`
            }
            onClick={() => navigate(`/alert/events/disclosure/${disclosure.id}`)}
          />
        )}

        {editable && (
          <div className="w-full flex justify-end">
            <Button
              tooltip="Rediger"
              size="xsmall"
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showEditModal()
              }}
              icon={faEdit}
            />

            <Button
              tooltip="Slett"
              size="xsmall"
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showDeleteModal()
              }}
              icon={faTrash}
            />
          </div>
        )}
      </Cell>
    </Row>
  )
}

export default TableDisclosure
