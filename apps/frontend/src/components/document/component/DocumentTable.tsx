import React from "react";
import {StyledBody, StyledHead, StyledHeadCell, StyledTable} from "baseui/table";
import {intl} from "../../../util";
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {DocumentTableRow} from "../../../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import DocumentDataRow from "./DocumentDataRow";
import {Block} from "baseui/block";
import {useStyletron} from "baseui";

type CreateDocumentProps = {
  tableData:DocumentTableRow[],
  setTableData:Function,
  setRowData:Function
}

const DocumentTable = ({tableData,setTableData,setRowData}:CreateDocumentProps) => {
  const [useCss] = useStyletron();
  return(
    <StyledTable className={useCss({overflow: "hidden !important"})}>
      <StyledHead>
        <StyledHeadCell style={{maxWidth: "45%"}}>{intl.informationType}</StyledHeadCell>
        <StyledHeadCell style={{maxWidth: "52.5%"}}>{intl.categories}</StyledHeadCell>
        <StyledHeadCell style={{maxWidth: "2.5%", justifyContent: "center"}}>
          <StatefulTooltip content={intl.addNew} placement={PLACEMENT.top}>
            <Button
              size={ButtonSize.compact}
              kind={KIND.tertiary}
              onClick={() => {
                let emptyRow = {informationTypes: undefined, categories: []} as DocumentTableRow;
                setTableData([...tableData, emptyRow]);
                console.log(tableData);
              }}>
              <FontAwesomeIcon icon={faPlus}/>
            </Button>
          </StatefulTooltip>
        </StyledHeadCell>
      </StyledHead>
      <StyledBody>
        {
          tableData.map((row, index) => DocumentDataRow(
            index,
            tableData,
            () => setRowData))
        }
      </StyledBody>
    </StyledTable>
  );
};

export default DocumentTable;
