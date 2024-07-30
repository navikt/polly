import { useEffect, useState } from 'react'
import { getAlertForInformationType } from '../../../api/AlertApi'
import { LegalBasesUse, Policy, PolicyAlert, policySort } from '../../../constants'
import { ListName, codelist } from '../../../service/Codelist'
import { useTable } from '../../../util/hooks'
import { RetentionView } from '../../Process/Retention'
import { LegalBasesNotClarified, ListLegalBasesInTable } from '../../common/LegalBasis'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'

type TableInformationtypeProps = {
  policies: Array<Policy>
  showPurpose: boolean
}

type Alerts = { [id: string]: PolicyAlert }

const InformationtypePolicyTable = ({ policies, showPurpose }: TableInformationtypeProps) => {
  const [table, sortColumn] = useTable<Policy, keyof Policy>(policies, { sorting: policySort, initialSortColumn: showPurpose ? 'purposes' : 'process' })
  const [alerts, setAlerts] = useState<Alerts>()

  useEffect(() => {
    ;(async () => {
      const infoTypeId = policies && policies.length && policies[0].informationType.id
      if (infoTypeId) {
        const infoTypeAlert = await getAlertForInformationType(infoTypeId)
        const reduced: Alerts = infoTypeAlert.processes
          .flatMap((process) => process.policies)
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
      emptyText="Ingen behandlinger"
      headers={
        <>
          <HeadCell title="Overordnet behandlingsaktivitet" column={'purposes'} tableState={[table, sortColumn]} />
          <HeadCell title="Behandling" column={'process'} tableState={[table, sortColumn]} />
          <HeadCell title="Personkategori" column={'subjectCategories'} tableState={[table, sortColumn]} />
          <HeadCell title="Behandlingsgrunnlag" column={'legalBases'} tableState={[table, sortColumn]} />
          <HeadCell title="Lagringsbehov" />
        </>
      }
    >
      {table.data.map((row: Policy, index: number) => (
        <Row key={index}>
          {showPurpose && (
            <Cell>
              <div className="flex flex-col">
                {row.purposes.map((purpose, index) => (
                  <div key={index}>
                    <RouteLink href={`/process/purpose/${purpose.code}`}>{codelist.getShortnameForCode(purpose)}</RouteLink>
                  </div>
                ))}
              </div>
            </Cell>
          )}

          <Cell>
            {/* todo mulitpurpose url */}
            <RouteLink href={`/process/purpose/${row.purposes[0].code}/${row.process.id}`}>{row.process && row.process.name}</RouteLink>
          </Cell>

          <Cell>{row.subjectCategories.map((subjectCategory) => codelist.getShortname(ListName.SUBJECT_CATEGORY, subjectCategory.code)).join(', ')}</Cell>

          <Cell>
            <div>
              {row.legalBasesUse === LegalBasesUse.DEDICATED_LEGAL_BASES && row.legalBases && row.legalBases.length > 0 && <ListLegalBasesInTable legalBases={row.legalBases} />}

              {!(row.legalBasesUse === LegalBasesUse.EXCESS_INFO || row.legalBasesUse === LegalBasesUse.UNRESOLVED) && row.process.legalBases && (
                <ListLegalBasesInTable legalBases={row.process.legalBases} />
              )}

              <LegalBasesNotClarified alert={alerts && alerts[row.id]} />
            </div>
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
