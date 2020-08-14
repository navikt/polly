import * as React from 'react'
import {useEffect, useState} from 'react'

import {LegalBasesNotClarified, ListLegalBasesInTable} from '../../common/LegalBasis'
import {codelist, ListName} from '../../../service/Codelist'
import {intl} from '../../../util'
import {LegalBasesUse, Policy, PolicyAlert, policySort} from '../../../constants'
import {useTable} from '../../../util/hooks'
import RouteLink from '../../common/RouteLink'
import {RetentionView} from '../../Process/Retention'
import {getAlertForInformationType} from '../../../api/AlertApi'
import {Block} from 'baseui/block'
import {Cell, HeadCell, Row, Table} from '../../common/Table'

type TableInformationtypeProps = {
  policies: Array<Policy>;
  showPurpose: boolean;
};

type Alerts = { [id: string]: PolicyAlert }

const InformationtypePolicyTable = ({ policies, showPurpose }: TableInformationtypeProps) => {
  const [table, sortColumn] = useTable<Policy, keyof Policy>(policies, { sorting: policySort, initialSortColumn: showPurpose ? 'purposeCode' : 'process' })
  const [alerts, setAlerts] = useState<Alerts>()

  useEffect(() => {
    (async () => {
      const infoTypeId = policies && policies.length && policies[0].informationType.id
      if (infoTypeId) {
        const infoTypeAlert = await getAlertForInformationType(infoTypeId)
        const reduced: Alerts = infoTypeAlert.processes
          .flatMap(p => p.policies)
          .reduce((agg, policy) => {
            agg[policy.policyId] = policy
            return agg
          }, {} as Alerts)
        setAlerts(reduced)
      }
    })()
  }, [policies])

  return (
    <Table
      emptyText={intl.processes}
      headers={
        <>
          <HeadCell title={intl.overallPurposeActivity} column={'purposeCode'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.process} column={'process'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.subjectCategories} column={'subjectCategories'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.legalBasesShort} column={'legalBases'} tableState={[table, sortColumn]} />
          <HeadCell title={intl.retention} />
        </>
      }>
      {table.data.map((row, index) => (
        <Row key={index}>
          {showPurpose && <Cell>
            <RouteLink href={`/process/purpose/${row.purposeCode.code}`}>
              {codelist.getShortnameForCode(row.purposeCode)}
            </RouteLink>
          </Cell>}

          <Cell>
            <RouteLink href={`/process/purpose/${row.purposeCode.code}/${row.process.id}`}>
              {row.process && row.process.name}
            </RouteLink>
          </Cell>

          <Cell>{row.subjectCategories.map(sc => codelist.getShortname(ListName.SUBJECT_CATEGORY, sc.code)).join(', ')}</Cell>

          <Cell>
            <Block>
              {row.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && row.legalBases && row.legalBases.length > 0 && (
                <ListLegalBasesInTable legalBases={row.legalBases} />
              )}

              {!(row.legalBasesUse === LegalBasesUse.EXCESS_INFO || row.legalBasesUse === LegalBasesUse.UNRESOLVED) &&
                row.process.legalBases && (
                  <ListLegalBasesInTable legalBases={row.process.legalBases} />
                )}

              <LegalBasesNotClarified alert={alerts && alerts[row.id]} />
            </Block>
          </Cell>

          <Cell>
            <RetentionView retention={row.process.retention} />
          </Cell>
        </Row>
      ))}

    </Table>
  )

}

export default InformationtypePolicyTable
