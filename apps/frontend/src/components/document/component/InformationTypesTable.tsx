import React from "react";
import { StyledCell, StyledHead, StyledHeadCell, StyledRow } from "baseui/table";
import { intl } from "../../../util";
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip";
import { Button, KIND, SIZE as ButtonSize } from "baseui/button";
import { DocumentInformationTypes, DocumentInfoTypeUse } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FieldArrayRenderProps } from "formik";
import FieldInformationType from "./FieldInformationType";
import FieldSubjectCategory from "./FieldSubjectCategory";
import { Error } from "../../common/ModalSchema";
import shortid from 'shortid'

type InformationTypesTableProps = {
  arrayHelpers: FieldArrayRenderProps,
}

const InformationTypesTable = (props: InformationTypesTableProps) => {
  const [tableContent, setTableContent] = React.useState([]);
  const { arrayHelpers } = props;

  const newRow = {
    id: shortid.generate(),
    informationTypeId: "",
    informationType: undefined,
    subjectCategories: []
  }

  const showDeleteRowButton = arrayHelpers.form.values.informationTypes.length > 1


  React.useEffect(() => {
    if (arrayHelpers.form.values.informationTypes.length < 1)
      arrayHelpers.push(newRow)

    setTableContent(arrayHelpers.form.values.informationTypes)
  }, [arrayHelpers]);

  return (
    <>
      <StyledHead>
        <StyledHeadCell style={{ maxWidth: "45%" }}>{intl.informationType}</StyledHeadCell>
        <StyledHeadCell style={{ maxWidth: "52.5%" }}>{intl.subjectCategories}</StyledHeadCell>
        <StyledHeadCell style={{ maxWidth: "2.5%", justifyContent: "center" }}>
          <StatefulTooltip content={intl.addNew} placement={PLACEMENT.top}>
            <Button
              type={"button"}
              size={ButtonSize.compact}
              kind={KIND.tertiary}
              onClick={() => { arrayHelpers.push({ id: shortid.generate(), informationTypeId: "", informationType: undefined, subjectCategories: [] }); }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </StatefulTooltip>
        </StyledHeadCell>
      </StyledHead>

      {tableContent.map((row: DocumentInfoTypeUse, index: number) => (
        <React.Fragment key={row.id}>
          <StyledRow>
            <StyledCell style={{ maxWidth: "45%" }}>
              <FieldInformationType
                documentInformationType={row}
                handleChange={(values: DocumentInformationTypes) => arrayHelpers.replace(index, values)}
              />
            </StyledCell>
            <StyledCell style={{ maxWidth: "52.5%" }}>
              <FieldSubjectCategory
                documentInformationType={row}
                handleChange={(values: DocumentInformationTypes) => arrayHelpers.replace(index, values)}
              />
            </StyledCell>
            <StyledCell style={{ maxWidth: "2.5%", justifyContent: "center" }}>
              {showDeleteRowButton && (
                <StatefulTooltip content={intl.delete}>
                  <Button
                    type={"button"}
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={() => {
                      arrayHelpers.remove(index);
                    }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </StatefulTooltip>
              )}

            </StyledCell>
          </StyledRow>

          <StyledRow>
            <StyledCell style={{ maxWidth: "45%" }}>
              <Error fieldName={`informationTypes[${index}].informationTypeId`} fullWidth={true} />
            </StyledCell>
            <StyledCell style={{ maxWidth: "52.5%" }}>
              <Error fieldName={`informationTypes[${index}].subjectCategories`} fullWidth={true} />
            </StyledCell>
            <StyledCell style={{ maxWidth: "2.5%", justifyContent: "center" }} />
          </StyledRow>
        </React.Fragment>
      ))}
    </>
  );
};

export default InformationTypesTable;
