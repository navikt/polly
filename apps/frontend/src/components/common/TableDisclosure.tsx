import * as React from 'react'
import { useEffect, useState } from 'react'
import { ListLegalBasesInTable } from './LegalBasis'
import { theme } from '../../util'
import { Disclosure, DisclosureAlert, DisclosureFormValues, disclosureSort } from '../../constants'
import { useTable } from '../../util/hooks'
import RouteLink from './RouteLink'
import { KIND, SIZE } from 'baseui/button'
import { faEdit, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { Block } from 'baseui/block'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'
import { convertDisclosureToFormValues } from '../../api'
import { Cell, HeadCell, Row, Table } from './Table'
import { canViewAlerts } from '../../pages/AlertEventPage'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { getAlertForDisclosure } from '../../api/AlertApi'

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
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false)
  const [showEditModal, setShowEditModal] = React.useState<boolean>()
  const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()
  const [alerts, setAlerts] = useState<Alerts>({})

  const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, { sorting: disclosureSort, initialSortColumn: showRecipient ? 'recipient' : 'name' })

  useEffect(() => {
    ;(async () => {
      const alertMap = (await Promise.all(list.map((d) => getAlertForDisclosure(d.id)))).reduce((acc: Alerts, alert) => {
        acc[alert.disclosureId] = alert
        return acc
      }, {} as Alerts)
      setAlerts(alertMap)
    })()
  }, [list])

  return (
    <React.Fragment>
      <Table
        emptyText='Ingen utlevering'
        headers={
          <>
            {showRecipient && <HeadCell title='Mottaker' column={'recipient'} tableState={[table, sortColumn]} />}
            <HeadCell title='Navn på utlevering' column={'name'} tableState={[table, sortColumn]} />
            <HeadCell title='Dokument' column={'document'} tableState={[table, sortColumn]} />
            <HeadCell title='Formål med utlevering' column={'recipientPurpose'} tableState={[table, sortColumn]} />
            <HeadCell title='Ytterligere beskrivelse' column={'description'} tableState={[table, sortColumn]} />
            <HeadCell title='Behandlingsgrunnlag' column={'legalBases'} tableState={[table, sortColumn]} />
            <HeadCell small />
          </>
        }
      >
        {table.data.map((row, index) => (
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
          title='Rediger utlevering'
          isOpen={showEditModal}
          initialValues={convertDisclosureToFormValues(selectedDisclosure)}
          submit={async (values) => (submitEditDisclosure && (await submitEditDisclosure(values)) ? setShowEditModal(false) : setShowEditModal(true))}
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
            <ParagraphMedium>
              Bekreft sletting av behandling for opplysningstypen {selectedDisclosure && selectedDisclosure.recipient.code}
            </ParagraphMedium>
          </ModalBody>

          <ModalFooter>
            <Block display="flex" justifyContent="flex-end">
              <Block alignSelf="flex-end">{errorModal && <p>{errorModal}</p>}</Block>
              <Button kind="secondary" onClick={() => setShowDeleteModal(false)} marginLeft marginRight>
                Avbryt
              </Button>
              <Button
                onClick={() => {
                  if (selectedDisclosure && submitDeleteDisclosure) {
                    submitDeleteDisclosure(selectedDisclosure).then((res) => {
                      if (res) {
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
            </Block>
          </ModalFooter>
        </Modal>
      )}
    </React.Fragment>
  )
}

const DisclosureRow = (props: {
  disclosure: Disclosure
  editable: boolean
  showRecipient: boolean
  alert: DisclosureAlert
  setSelectedDisclosure: (d: Disclosure) => void
  showEditModal: () => void
  showDeleteModal: () => void
}) => {
  const navigate = useNavigate()
  const { disclosure, editable, alert, showRecipient, setSelectedDisclosure, showEditModal, showDeleteModal } = props
  const hasAlert = alert?.missingArt6

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
          <Block width="100%" display="flex" justifyContent="flex-end">
            <Button
              tooltip='Rediger'
              size={SIZE.compact}
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showEditModal()
              }}
              icon={faEdit}
            />

            <Button
              tooltip='Slett'
              size={SIZE.compact}
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showDeleteModal()
              }}
              icon={faTrash}
            />
          </Block>
        )}
      </Cell>
    </Row>
  )
}

export default TableDisclosure
