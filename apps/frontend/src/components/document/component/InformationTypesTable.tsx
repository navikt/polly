import React from "react";
import {StyledBody, StyledCell, StyledHead, StyledHeadCell, StyledRow, StyledTable} from "baseui/table";
import {intl} from "../../../util";
import {PLACEMENT, StatefulTooltip} from "baseui/tooltip";
import {Button, KIND, SIZE as ButtonSize} from "baseui/button";
import {DocumentInformationTypes} from "../../../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useStyletron} from "baseui";
import {FieldArrayRenderProps} from "formik";
import FieldInformationType from "./FieldInformationType";
import FieldSubjectCategory from "./FieldSubjectCategory";
import {Error} from "../../common/ModalSchema";

type InformationTypesTableProps = {
  arrayHelpers: FieldArrayRenderProps,
}

const InformationTypesTable = (props: InformationTypesTableProps) => {
  const [useCss] = useStyletron();

  const [tableContent, setTableContent] = React.useState([]);

  const { arrayHelpers } = props

  React.useEffect(() => {
    console.log(arrayHelpers.form.values)
    setTableContent(arrayHelpers.form.values.informationTypes)
  },[arrayHelpers]);

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
              onClick={() => {arrayHelpers.push({informationTypeId: "", subjectCategories: []} as DocumentInformationTypes);}}>
              <FontAwesomeIcon icon={faPlus}/>
            </Button>
          </StatefulTooltip>
        </StyledHeadCell>
      </StyledHead>
      <StyledBody>

        {tableContent.map((row: DocumentInformationTypes, index: number) => (
          <React.Fragment key={JSON.stringify(row) + index}>
            <StyledRow>
              <StyledCell style={{maxWidth: "45%"}}>
                <FieldInformationType
                  index={index}
                  arrayHelpers={arrayHelpers}
                />
              </StyledCell>
              <StyledCell style={{maxWidth: "52.5%"}}>
                <FieldSubjectCategory
                  index={index}
                  arrayHelpers={arrayHelpers}
                />
              </StyledCell>
              <StyledCell style={{maxWidth: "2.5%", justifyContent: "center"}}>
                <StatefulTooltip content={intl.delete}>
                  <Button
                    type={"button"}
                    size={ButtonSize.compact}
                    kind={KIND.tertiary}
                    onClick={() => {
                      arrayHelpers.remove(index);
                    }}>
                    <FontAwesomeIcon icon={faTrash}/>
                  </Button>
                </StatefulTooltip>
              </StyledCell>
            </StyledRow>

            <StyledRow>
              <StyledCell style={{maxWidth: "45%"}}>
                <Error fieldName={`informationTypes[${index}].informationTypeId`} fullWidth={true}/>
              </StyledCell>
              <StyledCell style={{maxWidth: "52.5%"}}>
                <Error fieldName={`informationTypes[${index}].subjectCategories`} fullWidth={true}/>
              </StyledCell>
              <StyledCell style={{maxWidth: "2.5%", justifyContent: "center"}}/>
            </StyledRow>
          </React.Fragment>
        ))}

      </StyledBody>
    </StyledTable>
  );
};

export default InformationTypesTable;
