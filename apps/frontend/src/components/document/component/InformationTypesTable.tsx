import React from "react";
import {StyledBody, StyledHead, StyledHeadCell, StyledTable} from "baseui/table";
import {intl} from "../../../util";
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {DocumentInformationTypes} from "../../../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import DocumentDataRow from "./DocumentDataRow";
import {useStyletron} from "baseui";
import {FieldArrayRenderProps} from "formik";
import {DocumentTableRow} from "../common/model/DocumentTableRow";

type CreateDocumentProps = {
  tableData: DocumentTableRow[],
  setTableData: Function,
  setRowData: Function,
  arrayHelpers: FieldArrayRenderProps
  removeRow: Function
}

const InformationTypesTable = ({
                         tableData,
                         setTableData,
                         setRowData,
                         arrayHelpers,
                         removeRow
                       }: CreateDocumentProps) => {
  const [useCss] = useStyletron();
  return (
    <StyledTable className={useCss({overflow: "hidden !important"})}>
      <StyledHead>
        <StyledHeadCell style={{maxWidth: "45%"}}>{intl.informationType}</StyledHeadCell>
        <StyledHeadCell style={{maxWidth: "52.5%"}}>{intl.categories}</StyledHeadCell>
        <StyledHeadCell style={{maxWidth: "2.5%", justifyContent: "center"}}>
          <StatefulTooltip content={intl.addNew} placement={PLACEMENT.top}>
            <Button
              type={"button"}
              size={ButtonSize.compact}
              kind={KIND.tertiary}
              onClick={() => {
                let emptyRow = {informationTypes: undefined, categories: []} as DocumentTableRow;
                setTableData([...tableData, emptyRow]);
                arrayHelpers.push({informationTypeId: "", subjectCategories: []} as DocumentInformationTypes);
              }}>
              <FontAwesomeIcon icon={faPlus}/>
            </Button>
          </StatefulTooltip>
        </StyledHeadCell>
      </StyledHead>
      <StyledBody>
        {
          tableData.map((row, index) =>
            <DocumentDataRow
              key={index}
              index={index}
              tableData={tableData}
              setRowData={() => setRowData}
              arrayHelpers={arrayHelpers}
              removeRow={removeRow}/>
          )
        }
      </StyledBody>
    </StyledTable>
  );
};

export default InformationTypesTable;
