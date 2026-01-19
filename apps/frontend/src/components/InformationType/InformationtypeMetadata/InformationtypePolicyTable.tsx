import { Link, SortState, Table } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { getAlertForInformationType } from '../../../api/AlertApi'
import {
  ELegalBasesUse,
  IInformationTypeAlert,
  IPolicy,
  IPolicyAlert,
  IProcessAlert,
} from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { handleSort } from '../../../util/handleTableSort'
import { RetentionView } from '../../Process/Retention'
import { LegalBasesNotClarified, ListLegalBasesInTable } from '../../common/LegalBasis'

type TTableInformationtypeProps = {
  policies: Array<IPolicy>
  showPurpose: boolean
  codelistUtils: ICodelistProps
}

type TAlerts = { [id: string]: IPolicyAlert }

const InformationtypePolicyTable = (props: TTableInformationtypeProps) => {
  const { policies, showPurpose, codelistUtils } = props
  const [sort, setSort] = useState<SortState>()
  const [alerts, setAlerts] = useState<TAlerts>()

  let sortedData: IPolicy[] = policies

  const comparator = (a: IPolicy, b: IPolicy, orderBy: string): number => {
    switch (orderBy) {
      case 'purposes':
        return a.purposes[0].shortName.localeCompare(b.purposes[0].shortName)
      case 'process':
        return a.process.name.localeCompare(b.process.name)
      case 'subjectCategories':
        return a.subjectCategories[0].shortName.localeCompare(b.subjectCategories[0].shortName)
      default:
        return 0
    }
  }

  sortedData = sortedData.sort((a: IPolicy, b: IPolicy) => {
    if (sort) {
      return sort.direction === 'ascending'
        ? comparator(b, a, sort.orderBy)
        : comparator(a, b, sort.orderBy)
    }
    return 1
  })

  useEffect(() => {
    ;(async () => {
      const infoTypeId = policies && policies.length && policies[0].informationType.id
      if (infoTypeId) {
        const infoTypeAlert: IInformationTypeAlert = await getAlertForInformationType(infoTypeId)
        const reduced: TAlerts = infoTypeAlert.processes
          .flatMap((process: IProcessAlert) => process.policies)
          .reduce((agg: TAlerts, policy: IPolicyAlert) => {
            agg[policy.policyId] = policy
            return agg
          }, {} as TAlerts)
        setAlerts(reduced)
      }
    })()
  }, [policies])

  return (
    <Table size="small" sort={sort} onSortChange={(sortKey) => handleSort(sort, setSort, sortKey)}>
      <Table.Header>
        <Table.Row>
          {showPurpose && (
            <Table.ColumnHeader textSize="small" sortKey="purposes" className="w-/5" sortable>
              Overordnet behandlingsaktivitet
            </Table.ColumnHeader>
          )}
          <Table.ColumnHeader textSize="small" sortKey="process" className="w-2/5" sortable>
            Behandling
          </Table.ColumnHeader>
          <Table.ColumnHeader
            textSize="small"
            sortKey="subjectCategories"
            className="w-1/5"
            sortable
          >
            Personkategori
          </Table.ColumnHeader>
          <Table.ColumnHeader textSize="small" className="w-1/5">
            Behandlingsgrunnlag
          </Table.ColumnHeader>
          <Table.ColumnHeader textSize="small">Lagringsbehov</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.map((row: IPolicy, index: number) => (
          <Table.Row key={index}>
            {showPurpose && (
              <Table.DataCell textSize="small">
                <div className="flex flex-col">
                  {row.purposes.map((purpose: ICode, index: number) => (
                    <div key={index}>
                      <Link href={`/process/purpose/${purpose.code}`}>
                        {codelistUtils.getShortnameForCode(purpose)}
                      </Link>
                    </div>
                  ))}
                </div>
              </Table.DataCell>
            )}

            <Table.DataCell textSize="small">
              <Link href={`/process/purpose/${row.purposes[0].code}/${row.process.id}`}>
                {row.process && row.process.name}
              </Link>
            </Table.DataCell>

            <Table.DataCell textSize="small">
              {row.subjectCategories
                .map((subjectCategory: ICode) =>
                  codelistUtils.getShortname(EListName.SUBJECT_CATEGORY, subjectCategory.code)
                )
                .join(', ')}
            </Table.DataCell>

            <Table.DataCell textSize="small">
              <div>
                {row.legalBasesUse === ELegalBasesUse.DEDICATED_LEGAL_BASES &&
                  row.legalBases &&
                  row.legalBases.length > 0 && (
                    <ListLegalBasesInTable
                      legalBases={row.legalBases}
                      codelistUtils={codelistUtils}
                    />
                  )}

                {!(
                  row.legalBasesUse === ELegalBasesUse.EXCESS_INFO ||
                  row.legalBasesUse === ELegalBasesUse.UNRESOLVED
                ) &&
                  row.process.legalBases && (
                    <ListLegalBasesInTable
                      legalBases={row.process.legalBases}
                      codelistUtils={codelistUtils}
                    />
                  )}

                <LegalBasesNotClarified alert={alerts && alerts[row.id]} />
              </div>
            </Table.DataCell>

            <Table.DataCell textSize="small">
              <RetentionView retention={row.process.retention} />
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default InformationtypePolicyTable
