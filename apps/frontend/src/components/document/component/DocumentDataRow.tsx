import {DocumentTableRow} from "../../../constants";
import React from "react";
import {StyledCell, StyledRow} from "baseui/table";
import FieldInformationType from "./FieldInformationType";
import FieldSubjectCategory from "./FieldSubjectCategory";
import {StatefulTooltip} from "baseui/tooltip";
import {intl} from "../../../util";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FieldArrayRenderProps} from "formik";

const DocumentDataRow = (index: number,
                         tableData: DocumentTableRow[],
                         setRowData: Function,
                         arrayHelpers: FieldArrayRenderProps) => {
  return (
    <React.Fragment key={index}>
      <StyledRow>
        <StyledCell style={{maxWidth: "45%"}}>
          <FieldInformationType
            setValue={setRowData(index, tableData)}
            rowData={tableData[index]}
            setRowData={setRowData}
            index={index}
          />
        </StyledCell>

        <StyledCell style={{maxWidth: "52.5%"}}>
          <FieldSubjectCategory value={""} rowData={tableData[index]} setRowData={setRowData} index={index}/>
        </StyledCell>

        <StyledCell style={{maxWidth: "2.5%", justifyContent: "center"}}>
          <StatefulTooltip content={intl.delete}>
            <Button
              size={ButtonSize.compact}
              kind={KIND.tertiary}
              onClick={() => {
                console.log(tableData);
              }}>
              <FontAwesomeIcon icon={faTrash}/>
            </Button>
          </StatefulTooltip>
        </StyledCell>
      </StyledRow>
    </React.Fragment>
  )
};

export default DocumentDataRow;
