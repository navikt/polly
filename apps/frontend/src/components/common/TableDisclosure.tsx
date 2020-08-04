import * as React from 'react'
import {useEffect, useState} from 'react'

import {ListLegalBasesInTable} from './LegalBasis'
import {intl, theme} from '../../util'
import {Disclosure, DisclosureAlert, DisclosureFormValues, disclosureSort} from '../../constants'
import {useTable} from '../../util/hooks'
import RouteLink from './RouteLink'
import {KIND, SIZE} from 'baseui/button'
import {faEdit, faExclamationCircle, faTrash} from '@fortawesome/free-solid-svg-icons'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {Paragraph2} from 'baseui/typography'
import {Block} from 'baseui/block'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'
import {mapDisclosureToFormValues} from '../../api'
import {Cell, HeadCell, Row, Table} from './Table'
import {canViewAlerts} from '../../pages/AlertEventPage'
import {useHistory} from 'react-router-dom'
import Button from './Button'
import {getAlertForDisclosure} from '../../api/AlertApi'

type TableDisclosureProps = {
  list: Array<Disclosure>;
  showRecipient: boolean;
  editable: boolean;
  submitDeleteDisclosure?: (disclosure: Disclosure) => Promise<boolean>;
  submitEditDisclosure?: (disclosure: DisclosureFormValues) => Promise<boolean>;
  errorModal?: string;
  onCloseModal?: () => void;
};

const TableDisclosure = ({list, showRecipient, submitDeleteDisclosure, submitEditDisclosure, errorModal, editable, onCloseModal}: TableDisclosureProps) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false)
  const [showEditModal, setShowEditModal] = React.useState<boolean>()
  const [selectedDisclosure, setSelectedDisclosure] = React.useState<Disclosure>()

  const [table, sortColumn] = useTable<Disclosure, keyof Disclosure>(list, {sorting: disclosureSort, initialSortColumn: showRecipient ? 'recipient' : 'name'})

  return (
    <React.Fragment>

      <Table
        emptyText={intl.disclosuresToThirdParty.toLowerCase()}
        headers={
          <>
            {showRecipient && (
              <HeadCell title={intl.recipient} column={'recipient'} tableState={[table, sortColumn]}/>
            )}
            <HeadCell title={intl.disclosureName} column={'name'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.document} column={'document'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.disclosurePurpose} column={'recipientPurpose'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.additionalDescription} column={'description'} tableState={[table, sortColumn]}/>
            <HeadCell title={intl.legalBasisShort} column={'legalBases'} tableState={[table, sortColumn]}/>

            {(editable || canViewAlerts()) && <HeadCell small/>}
          </>
        }
      >
        {table.data.map((row, index) =>
          <DisclosureRow key={index} disclosure={row} editable={editable} showRecipient={showRecipient}
                         setSelectedDisclosure={setSelectedDisclosure} showEditModal={() => setShowEditModal(true)} showDeleteModal={() => setShowDeleteModal(true)}/>
        )}
      </Table>

      {editable && showEditModal && selectedDisclosure && (
        <ModalThirdParty
          title={intl.editDisclosure}
          isOpen={showEditModal}
          initialValues={mapDisclosureToFormValues(selectedDisclosure)}
          submit={async (values) => submitEditDisclosure && await submitEditDisclosure(values) ? setShowEditModal(false) : setShowEditModal(true)}
          onClose={() => {
            onCloseModal && onCloseModal()
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
          unstable_ModalBackdropScroll={true}
          size="default"
        >
          <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
          <ModalBody>
            <Paragraph2>{intl.confirmDeletePolicyText} {selectedDisclosure && selectedDisclosure.recipient.code}</Paragraph2>
          </ModalBody>

          <ModalFooter>
            <Block display="flex" justifyContent="flex-end">
              <Block alignSelf="flex-end">{errorModal && <p>{errorModal}</p>}</Block>
              <Button
                kind="secondary"
                onClick={() => setShowDeleteModal(false)}
                marginLeft marginRight
              >
                {intl.abort}
              </Button>
              <Button onClick={() => {
                if (selectedDisclosure)
                  submitDeleteDisclosure && submitDeleteDisclosure(selectedDisclosure) ? setShowDeleteModal(false) : setShowDeleteModal(true)
              }}
              >{intl.delete}</Button>
            </Block>
          </ModalFooter>
        </Modal>
      )}
    </React.Fragment>
  )
}

const DisclosureRow = (props: {
  disclosure: Disclosure, editable: boolean, showRecipient: boolean,
  setSelectedDisclosure: (d: Disclosure) => void, showEditModal: () => void, showDeleteModal: () => void
}) => {
  const history = useHistory()
  const {disclosure, editable, showRecipient, setSelectedDisclosure, showEditModal, showDeleteModal} = props
  const [alert, setAlert] = useState<DisclosureAlert>()

  useEffect(() => {
    (async () => {
      setAlert(await getAlertForDisclosure(disclosure.id))
    })()
  }, [disclosure])

  return (
    <Row>
      {showRecipient && (
        <Cell><RouteLink href={`/thirdparty/${disclosure.recipient.code}`}>{disclosure.recipient.shortName}</RouteLink></Cell>
      )}
      <Cell>{disclosure.name}</Cell>
      <Cell>
        {<RouteLink href={`/document/${disclosure.documentId}`}>{disclosure.document?.name}</RouteLink>}
      </Cell>
      <Cell>{disclosure.recipientPurpose}</Cell>
      <Cell>{disclosure.description}</Cell>
      <Cell>
        {disclosure.legalBases && (
          <ListLegalBasesInTable legalBases={disclosure.legalBases}/>
        )}
      </Cell>
      {(editable || canViewAlerts()) && (
        <Cell small>
          {canViewAlerts() &&
          <Button type='button' kind='tertiary' size='compact'
                  icon={faExclamationCircle} tooltip={intl.alerts + alert?.missingArt6 ? `: ${intl.MISSING_ARTICLE_6}` : ''}
                  $style={{color: alert ? theme.colors.warning500 : undefined}}
                  onClick={() => history.push(`/alert/events/disclosure/${disclosure.id}`)}
          />}

          {editable &&
          <Block width="100%" display="flex" justifyContent="flex-end">
            <Button
              tooltip={intl.edit}
              size={SIZE.compact}
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showEditModal()
              }}
              icon={faEdit}
            />

            <Button
              tooltip={intl.delete}
              size={SIZE.compact}
              kind={KIND.tertiary}
              onClick={() => {
                setSelectedDisclosure(disclosure)
                showDeleteModal()
              }}
              icon={faTrash}
            />
          </Block>}

        </Cell>
      )}
    </Row>
  )
}

export default TableDisclosure
