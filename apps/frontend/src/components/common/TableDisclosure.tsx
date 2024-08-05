import { faEdit, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { KIND, SIZE } from 'baseui/button'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Fragment, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { convertDisclosureToFormValues } from '../../api'
import { getAlertForDisclosure } from '../../api/AlertApi'
import { Disclosure, DisclosureAlert, DisclosureFormValues, disclosureSort } from '../../constants'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { theme } from '../../util'
import { useTable } from '../../util/hooks'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'
import Button from './Button'
import { ListLegalBasesInTable } from './LegalBasis'
import RouteLink from './RouteLink'
import { Cell, HeadCell, Row, Table } from './Table'

type TableDisclosureProps = {
  list: Array<Disclosure>
  showRecipient: boolean
  editable: boolean
  submitDeleteDisclosure?: (disclosure: Disclosure) => Promise<boolean>
  submitEditDisclosure?: (disclosure: DisclosureFormValues) => Promise<boolean>
  errorModal?: string
  onCloseModal?: () => void
}

type Alerts = { [k: string]: DisclosureAlert }
const TableDisclosure = ({ list, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal }: TableDisclosureProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>()
  const [selectedDisclosure, setSelectedDisclosure] = useState<Disclosure>()
  const [alerts, setAlerts] = useState<Alerts>({})

  const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, { sorting: disclosureSort, initialSortColumn: showRecipient ? 'recipient' : 'name' })

  useEffect(() => {
    ;(async () => {
      const alertMap: Alerts = (await Promise.all(list.map((list: Disclosure) => getAlertForDisclosure(list.id)))).reduce((acc: Alerts, alert: DisclosureAlert) => {
        acc[alert.disclosureId] = alert
        return acc
      }, {} as Alerts)
      setAlerts(alertMap)
    })()
  }, [list])

  return (
    <Fragment>
      <Table
        emptyText="Ingen utlevering"
        headers={
          <>
            {showRecipient && <HeadCell title="Mottaker" column="recipient" tableState={[table, sortColumn]} />}
            <HeadCell title="Navn på utlevering" column="name" tableState={[table, sortColumn]} />
            <HeadCell title="Dokument" column="document" tableState={[table, sortColumn]} />
            <HeadCell title="Formål med utlevering" column="recipientPurpose" tableState={[table, sortColumn]} />
            <HeadCell title="Ytterligere beskrivelse" column="description" tableState={[table, sortColumn]} />
            <HeadCell title="Behandlingsgrunnlag" column="legalBases" tableState={[table, sortColumn]} />
            <HeadCell small />
          </>
        }
      >
        {table.data.map((row: Disclosure, index: number) => (
          <DisclosureRow
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
          submit={async (values: DisclosureFormValues) => (submitEditDisclosure && (await submitEditDisclosure(values)) ? setShowEditModal(false) : setShowEditModal(true))}
          onClose={() => {
            onCloseModal && onCloseModal()
            setShowEditModal(false)
          }}
          errorOnCreate={errorModal}
          disableRecipientField={true}
        />
      )}

      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} isOpen={showDeleteModal} animate size="default">
          <ModalHeader>Bekreft sletting</ModalHeader>
          <ModalBody>
            <ParagraphMedium>Bekreft sletting av behandling for opplysningstypen {selectedDisclosure && selectedDisclosure.recipient.code}</ParagraphMedium>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end">
              <div className="self-end">{errorModal && <p>{errorModal}</p>}</div>
              <Button kind="secondary" onClick={() => setShowDeleteModal(false)} marginLeft marginRight>
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
  disclosure: Disclosure
  editable: boolean
  showRecipient: boolean
  alert: DisclosureAlert
  setSelectedDisclosure: (disclosure: Disclosure) => void
  showEditModal: () => void
  showDeleteModal: () => void
}

const DisclosureRow = (props: IDisclosureRowProps) => {
  const { disclosure, editable, alert, showRecipient, setSelectedDisclosure, showEditModal, showDeleteModal } = props
  const navigate: NavigateFunction = useNavigate()
  const hasAlert: boolean = alert?.missingArt6

  return (
    <Row>
      {showRecipient && (
        <Cell>
          <RouteLink href={`/thirdparty/${disclosure.recipient.code}`}>{disclosure.recipient.shortName}</RouteLink>
        </Cell>
      )}
      <Cell>{disclosure.name}</Cell>
      <Cell>{<RouteLink href={`/document/${disclosure.documentId}`}>{disclosure.document?.name}</RouteLink>}</Cell>
      <Cell>{disclosure.recipientPurpose}</Cell>
      <Cell>{disclosure.description}</Cell>
      <Cell>{disclosure.legalBases && <ListLegalBasesInTable legalBases={disclosure.legalBases} />}</Cell>
      <Cell small>
        {hasAlert && canViewAlerts() && (
          <Button
            type="button"
            kind="tertiary"
            size="compact"
            icon={faExclamationCircle}
            tooltip={hasAlert ? `Varsler: Behandlingsgrunnlag for artikkel 6 mangler` : `Varsler: Nei`}
            $style={{ color: hasAlert ? theme.colors.warning500 : undefined }}
            onClick={() => navigate(`/alert/events/disclosure/${disclosure.id}`)}
          />
        )}

        {editable && (
          <div className="w-full flex justify-end">
            <Button
              tooltip="Rediger"
              size={SIZE.compact}
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showEditModal()
              }}
              icon={faEdit}
            />

            <Button
              tooltip="Slett"
              size={SIZE.compact}
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
