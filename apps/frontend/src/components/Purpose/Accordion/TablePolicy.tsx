import * as React from "react";
import { useEffect, useState } from "react";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { Block } from "baseui/block";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faInfo, faInfoCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "baseui/modal";
import { Label2, Paragraph2 } from "baseui/typography";
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"

import { codelist, ListName } from "../../../service/Codelist"
import { Sensitivity } from "../../InformationType/Sensitivity"
import ModalPolicy from "./ModalPolicy";
import { LegalBasesNotClarified, ListLegalBasesInTable } from "../../common/LegalBasis"
import { Document, Policy, PolicyFormValues, policySort, Process, ProcessAlert } from "../../../constants"
import { intl } from "../../../util"
import { convertPolicyToFormValues, getDocument } from "../../../api"
import { useTable } from "../../../util/hooks"
import RouteLink from "../../common/RouteLink"
import { ActiveIndicator } from "../../common/Durations"
import { AuditButton } from "../../audit/AuditButton"
import _ from "lodash"
import { getAlertForProcess } from "../../../api/AlertApi"
import { Cell, HeadCell, Row, SmallCell, SmallHeadCell, Table } from "../../common/Table"


type TablePurposeProps = {
  process: Process;
  hasAccess: boolean;
  errorPolicyModal: string | null;
  errorDeleteModal: string | null;
  submitEditPolicy: (policy: PolicyFormValues) => Promise<boolean>;
  submitDeletePolicy: (policy: Policy) => Promise<boolean>;
};

type Docs = { [id: string]: Document }
const TablePolicy = ({process, hasAccess, errorPolicyModal, errorDeleteModal, submitEditPolicy, submitDeletePolicy}: TablePurposeProps) => {
  const [policies, setPolicies] = React.useState<Policy[]>(process.policies)
  const [currentPolicy, setCurrentPolicy] = React.useState<Policy>()
  const [showEditModal, setShowEditModal] = React.useState(false)
  const [showPolicyInfo, setShowPolicyInfo] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [table, sortColumn] = useTable<Policy, keyof Policy>(policies, {sorting: policySort, initialSortColumn: "informationType", showLast: (p) => !p.active})
  const [alert, setAlert] = useState<ProcessAlert>()

  useEffect(() => {
    (async () => {
      setAlert(await getAlertForProcess(process.id))
    })()
  }, [process, policies])

  React.useEffect(() => {
    setPolicies(process ? process.policies : [])
  }, [process]);

  const [docs, setDocs] = useState<Docs>({})

  useEffect(() => {
    (async () => {
      const allIds = _.uniq(process.policies.flatMap(p => p.documentIds)).filter(id => !!id)
      const docMap = (await Promise.all(allIds.map(id => getDocument(id!)))).reduce((acc: Docs, doc) => {
        acc[doc.id] = doc;
        return acc
      }, {} as Docs)

      setDocs(docMap)
    })()
  }, [process])

  return (
    <React.Fragment>
      <Table headers={
        <>
          <HeadCell title={intl.informationType} column={'informationType'} tableState={[table, sortColumn]}/>
          <HeadCell title={intl.subjectCategories} column={'subjectCategories'} tableState={[table, sortColumn]}/>
          <HeadCell title={intl.legalBasisShort} column={'legalBases'} tableState={[table, sortColumn]}/>
          <SmallHeadCell/>
        </>
      }>
        {table.data.map((row: Policy, index: number) => {
          const selectedRow = row.id === currentPolicy?.id
          return (
            <React.Fragment key={index}>
              <Row inactiveRow={!row.active} selectedRow={showPolicyInfo && selectedRow}>
                <Cell>
                  <Block display="flex" width="100%" justifyContent="space-between">
                    <Block>
                      <Sensitivity sensitivity={row.informationType.sensitivity}/>&nbsp;
                      <RouteLink href={`/informationtype/${row.informationType.id}`} width="25%">
                        {row.informationType.name}
                      </RouteLink>
                    </Block>
                    <Block>
                      <StatefulTooltip content={() => intl.documents}>
                        <Block $style={{opacity: "80%"}}>
                          {!!row.documentIds?.length && '(' + row.documentIds?.map(id => (docs[id] || {}).name).join(", ") + ')'}
                        </Block>
                      </StatefulTooltip>
                    </Block>
                  </Block>
                </Cell>

                <Cell>{row.subjectCategories.map(sc => codelist.getShortname(ListName.SUBJECT_CATEGORY, sc.code)).join(", ")}</Cell>
                <Cell>
                  <Block>
                    <LegalBasesNotClarified alert={alert?.policies.filter(p => p.policyId === row.id)[0]}/>

                    {row.legalBases && row.legalBases.length > 0 && (
                      <ListLegalBasesInTable legalBases={row.legalBases}/>
                    )}
                  </Block>
                </Cell>
                <SmallCell>
                  <Block display="flex" justifyContent="flex-end" width="100%">
                    <StatefulTooltip content={intl.info} placement={PLACEMENT.top}>
                      <Button
                        size={ButtonSize.compact}
                        kind={KIND.tertiary}
                        onClick={() => {
                          setCurrentPolicy(row)
                          setShowPolicyInfo(!selectedRow || !showPolicyInfo)
                        }}
                      >
                        <FontAwesomeIcon icon={showPolicyInfo && selectedRow ? faInfoCircle : faInfo}/>
                      </Button>
                    </StatefulTooltip>
                    {hasAccess && (
                      <>
                        <StatefulTooltip content={intl.edit} placement={PLACEMENT.top}>
                          <Button
                            size={ButtonSize.compact}
                            kind={KIND.tertiary}
                            onClick={() => {
                              setCurrentPolicy(row)
                              setShowEditModal(true)
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit}/>
                          </Button>
                        </StatefulTooltip>
                        <StatefulTooltip content={intl.delete} placement={PLACEMENT.top}>
                          <Button
                            size={ButtonSize.compact}
                            kind={KIND.tertiary}
                            onClick={() => {
                              setCurrentPolicy(row)
                              setShowDeleteModal(true)
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash}/>
                          </Button>
                        </StatefulTooltip>
                      </>
                    )}
                  </Block>
                </SmallCell>
              </Row>
              {showPolicyInfo && selectedRow &&
              <Row infoRow={true}>
                <Cell>
                  <Block display="flex" justifyContent="space-between" width="100%">
                    <Block><ActiveIndicator {...row} alwaysShow={true} preText={intl.validityOfPolicy} showDates/></Block>
                    <AuditButton id={row.id}/>
                  </Block>
                </Cell>
              </Row>
              }
            </React.Fragment>
          )
        })}
      </Table>
      {!table.data.length && <Label2 margin="1rem">{intl.emptyTable} {intl.informationTypes}</Label2>}

      {showEditModal && currentPolicy && (
        <ModalPolicy
          title={intl.policyEdit}
          initialValues={convertPolicyToFormValues(currentPolicy)}
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
          isOpen={showDeleteModal}
          animate
          size="default"
        >
          <ModalHeader>{intl.confirmDeleteHeader}</ModalHeader>
          <ModalBody>
            <Paragraph2>{intl.confirmDeletePolicyText} {currentPolicy.informationType.name}</Paragraph2>
          </ModalBody>

          <ModalFooter>
            <Block display="flex" justifyContent="flex-end">
              <Block alignSelf="flex-end">{errorDeleteModal && <p>{errorDeleteModal}</p>}</Block>
              <Button
                kind="secondary"
                onClick={() => setShowDeleteModal(false)}
                overrides={{BaseButton: {style: {marginRight: '1rem', marginLeft: '1rem'}}}}
              >
                {intl.abort}
              </Button>
              <Button onClick={() => {
                submitDeletePolicy(currentPolicy).then(() => setShowDeleteModal(false)).catch(() => setShowDeleteModal(true))
              }
              }>{intl.delete}</Button>
            </Block>
          </ModalFooter>
        </Modal>
      )}

    </React.Fragment>
  );
};

export default TablePolicy;
