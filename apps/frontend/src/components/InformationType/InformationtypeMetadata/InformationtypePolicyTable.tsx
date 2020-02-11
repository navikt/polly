import * as React from "react";
import { useEffect, useState } from "react";
import { SortableHeadCell, StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable } from "baseui/table";
import { useStyletron, withStyle } from "baseui";

import { LegalBasesNotClarified, ListLegalBasesInTable } from "../../common/LegalBasis"
import { codelist, ListName } from "../../../service/Codelist"
import { intl } from "../../../util"
import { Policy, PolicyAlert, policySort } from "../../../constants"
import { useTable } from "../../../util/hooks"
import RouteLink from "../../common/RouteLink"
import { Label2 } from "baseui/typography"
import { RetentionView } from "../../Purpose/Retention"
import { getAlertForInformationType } from "../../../api/AlertApi"
import { Block } from "baseui/block"

const StyledHeader = withStyle(StyledHead, {
  backgroundColor: "transparent",
  boxShadow: "none",
  borderBottom: "2px solid #E9E7E7"
});

const CustomStyledRow = withStyle(StyledRow, {
  borderBottom: "1px solid #E9E7E7",
  padding: "8px",
  fontSize: "24px"
});

type TableInformationtypeProps = {
  policies: Array<Policy>;
  showPurpose: boolean;
};

type Alerts = { [id: string]: PolicyAlert }

const InformationtypePolicyTable = ({policies, showPurpose}: TableInformationtypeProps) => {
  const [useCss, theme] = useStyletron();
  const [table, sortColumn] = useTable<Policy, keyof Policy>(policies, {sorting: policySort, initialSortColumn: showPurpose ? "purposeCode" : "process"})
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
    <React.Fragment>
      <StyledTable className={useCss({overflow: "hidden !important"})}>
        <StyledHeader>
          {showPurpose && <SortableHeadCell
            title={intl.purpose}
            direction={table.direction.purposeCode}
            onSort={() => sortColumn('purposeCode')}
            fillClickTarget
          />}

          <SortableHeadCell
            title={intl.process}
            direction={table.direction.process}
            onSort={() => sortColumn('process')}
            fillClickTarget
          />

          <SortableHeadCell
            title={intl.subjectCategories}
            direction={table.direction.subjectCategories}
            onSort={() => sortColumn('subjectCategories')}
            fillClickTarget
          />

          <SortableHeadCell
            title={intl.legalBasisShort}
            direction={table.direction.legalBases}
            onSort={() => sortColumn('legalBases')}
          />

          <StyledHeadCell>{intl.retention}</StyledHeadCell>
        </StyledHeader>

        <StyledBody>
          {table.data.map((row, index) => (
            <CustomStyledRow key={index}>
              {showPurpose && <StyledCell>
                <RouteLink href={`/purpose/${row.purposeCode.code}`}>
                  {codelist.getShortnameForCode(row.purposeCode)}
                </RouteLink>
              </StyledCell>}

              <StyledCell>
                <RouteLink href={`/purpose/${row.purposeCode.code}/${row.process.id}`}>
                  {row.process && row.process.name}
                </RouteLink>
              </StyledCell>

              <StyledCell>{row.subjectCategories.map(sc => codelist.getShortname(ListName.SUBJECT_CATEGORY, sc.code)).join(", ")}</StyledCell>

              <StyledCell>
                <Block>
                  {!row.legalBasesInherited && row.legalBases && row.legalBases.length > 0 && (
                    <ListLegalBasesInTable legalBases={row.legalBases}/>
                  )}

                  {row.legalBasesInherited && row.process.legalBases && (
                    <ListLegalBasesInTable legalBases={row.process.legalBases}/>
                  )}

                  <LegalBasesNotClarified alert={alerts && alerts[row.id]}/>
                </Block>
              </StyledCell>

              <StyledCell>
                <RetentionView retention={row.process.retention}/>
              </StyledCell>
            </CustomStyledRow>
          ))}
        </StyledBody>
      </StyledTable>
      {!table.data.length && <Label2 margin="1rem">{intl.emptyTable} {intl.processes}</Label2>}
    </React.Fragment>
  );
};

export default InformationtypePolicyTable;
