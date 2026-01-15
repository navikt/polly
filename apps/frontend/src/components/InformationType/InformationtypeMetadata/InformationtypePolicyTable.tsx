import { useEffect, useState } from 'react'
import { getAlertForInformationType } from '../../../api/AlertApi'
import {
  ELegalBasesUse,
  IInformationTypeAlert,
  IPolicy,
  IPolicyAlert,
  IProcessAlert,
  getPolicySort,
} from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'
import { useTable } from '../../../util/hooks'
import { RetentionView } from '../../Process/Retention'
import { LegalBasesNotClarified, ListLegalBasesInTable } from '../../common/LegalBasis'
import RouteLink from '../../common/RouteLink'
import { Cell, HeadCell, Row, Table } from '../../common/Table'

type TTableInformationtypeProps = {
  policies: Array<IPolicy>
  showPurpose: boolean
  codelistUtils: ICodelistProps
}

type TAlerts = { [id: string]: IPolicyAlert }

const InformationtypePolicyTable = (props: TTableInformationtypeProps) => {
  const { policies, showPurpose, codelistUtils } = props

  const [table, sortColumn] = useTable<IPolicy, keyof IPolicy>(policies, {
    sorting: getPolicySort(codelistUtils),
    initialSortColumn: showPurpose ? 'purposes' : 'process',
  })
  const [alerts, setAlerts] = useState<TAlerts>()

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
    <Table
      emptyText="Ingen behandlinger"
      headers={
        <>
          {showPurpose && (
            <HeadCell
              title="Overordnet behandlingsaktivitet"
              column="purposes"
              tableState={[table, sortColumn]}
            />
          )}

          <HeadCell title="Behandling" column="process" tableState={[table, sortColumn]} />
          <HeadCell
            title="Personkategori"
            column="subjectCategories"
            tableState={[table, sortColumn]}
          />
          <HeadCell
            title="Behandlingsgrunnlag"
            column="legalBases"
            tableState={[table, sortColumn]}
          />
          <HeadCell title="Lagringsbehov" />
        </>
      }
    >
      {table.data.map((row: IPolicy, index: number) => (
        <Row key={index}>
          {showPurpose && (
            <Cell>
              <div className="flex flex-col">
                {row.purposes.map((purpose: ICode, index: number) => (
                  <div key={index}>
                    <RouteLink href={`/process/purpose/${purpose.code}`}>
                      {codelistUtils.getShortnameForCode(purpose)}
                    </RouteLink>
                  </div>
                ))}
              </div>
            </Cell>
          )}

          <Cell>
            {/* todo mulitpurpose url */}
            <RouteLink href={`/process/purpose/${row.purposes[0].code}/${row.process.id}`}>
              {row.process && row.process.name}
            </RouteLink>
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
