import * as React from 'react'

import {ListLegalBasesInTable} from './LegalBasis'
import {intl} from '../../util'
import {Disclosure, DisclosureFormValues, disclosureSort} from '../../constants'
import {useTable} from '../../util/hooks'
import RouteLink from './RouteLink'
import {PLACEMENT, StatefulTooltip} from 'baseui/tooltip'
import {Button, KIND, SIZE} from 'baseui/button'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'baseui/modal'
import {Paragraph2} from 'baseui/typography'
import {Block} from 'baseui/block'
import ModalThirdParty from '../ThirdParty/ModalThirdPartyForm'
import {mapDisclosureToFormValues} from '../../api'
import {features} from '../../util/feature-toggle'
import {Cell, HeadCell, Row, Table} from './Table'

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
        emptyText={intl.disclosures}
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

            {editable && <HeadCell small/>}
          </>
        }
      >
        {table.data.map((row, index) => (
          <Row key={index}>
            {showRecipient && (
              <Cell>
                {features.enableThirdParty ?
                  <RouteLink href={`/thirdparty/${row.recipient.code}`}>{row.recipient.shortName}</RouteLink>
                  : row.recipient.shortName
                }
              </Cell>
            )}
            <Cell>{row.name}</Cell>
            <Cell>
              {<RouteLink href={`/document/${row.documentId}`}>{row.document?.name}</RouteLink>}
            </Cell>
            <Cell>{row.recipientPurpose}</Cell>
            <Cell>{row.description}</Cell>
            <Cell>
              {row.legalBases && (
                <ListLegalBasesInTable legalBases={row.legalBases}/>
              )}
            </Cell>
            {editable && (
              <Cell small>
                <Block width="100%" display="flex" justifyContent="flex-end">
                  <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
                    <Button
                      size={SIZE.compact}
                      kind={KIND.tertiary}
                      onClick={() => {
                        setSelectedDisclosure(row)
                        setShowEditModal(true)
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit}/>
                    </Button>
                  </StatefulTooltip>

                  <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
                    <Button
                      size={SIZE.compact}
                      kind={KIND.tertiary}
                      onClick={() => {
                        setSelectedDisclosure(row)
                        setShowDeleteModal(true)
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash}/>
                    </Button>
                  </StatefulTooltip>
                </Block>

              </Cell>
            )}

          </Row>
        ))}
      </Table>

      {editable && showEditModal && selectedDisclosure && (
        <ModalThirdParty
          title="Rediger utlevering"
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
                overrides={{BaseButton: {style: {marginRight: '1rem', marginLeft: '1rem'}}}}
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

export default TableDisclosure
