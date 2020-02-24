import React from "react";
import {StyledCell, StyledHead, StyledHeadCell, StyledRow} from "baseui/table";
import {intl} from "../../../util";
import {KIND, SIZE as ButtonSize} from "baseui/button";
import {DocumentInformationTypes, DocumentInfoTypeUse} from "../../../constants";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FieldArrayRenderProps} from "formik";
import FieldInformationType from "./FieldInformationType";
import FieldSubjectCategory from "./FieldSubjectCategory";
import {Error} from "../../common/ModalSchema";
import shortid from 'shortid'
import NewButton from '../../common/Button'

type InformationTypesTableProps = {
  arrayHelpers: FieldArrayRenderProps,
}

const InformationTypesTable = (props: InformationTypesTableProps) => {
  const [tableContent, setTableContent] = React.useState([]);
  const {arrayHelpers} = props;

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
        <StyledHeadCell style={{maxWidth: "45%"}}>{intl.informationType}</StyledHeadCell>
        <StyledHeadCell style={{maxWidth: "45%"}}>{intl.subjectCategories}</StyledHeadCell>
        <StyledHeadCell style={{maxWidth: "10%", justifyContent: "center"}}>
          <NewButton
            kind={KIND.secondary}
            size={ButtonSize.compact}
            icon={faPlus}
            tooltip={intl.addNew}
            onClick={() => {
              arrayHelpers.push({
                id: shortid.generate(),
                informationTypeId: "",
                informationType: undefined,
                subjectCategories: []
              });
            }}
          >
            {intl.addNew}
          </NewButton>
        </StyledHeadCell>
      </StyledHead>

      {tableContent.map((row: DocumentInfoTypeUse, index: number) => (
        <React.Fragment key={row.id}>
          <StyledRow>
            <StyledCell style={{maxWidth: "45%"}}>
              <FieldInformationType
                documentInformationType={row}
                handleChange={(values: DocumentInformationTypes) => arrayHelpers.replace(index, values)}
              />
            </StyledCell>
            <StyledCell style={{maxWidth: "45%"}}>
              <FieldSubjectCategory
                documentInformationType={row}
                handleChange={(values: DocumentInformationTypes) => arrayHelpers.replace(index, values)}
              />
            </StyledCell>
            <StyledCell style={{maxWidth: "10%", justifyContent: "center"}}>
              {showDeleteRowButton && (
                <NewButton
                  kind={KIND.secondary}
                  size={ButtonSize.compact}
                  icon={faTrash}
                  tooltip={intl.delete}
                  onClick={() => {
                    arrayHelpers.remove(index);
                  }}
                >
                  {intl.delete}
                </NewButton>
              )}
            </StyledCell>
          </StyledRow>
          <StyledRow>
            <StyledCell style={{maxWidth: "45%"}}>
              <Error fieldName={`informationTypes[${index}].informationTypeId`} fullWidth={true}/>
            </StyledCell>
            <StyledCell style={{maxWidth: "45%"}}>
              <Error fieldName={`informationTypes[${index}].subjectCategories`} fullWidth={true}/>
            </StyledCell>
            <StyledCell style={{maxWidth: "10%", justifyContent: "center"}}/>
          </StyledRow>
        </React.Fragment>
      ))}
    </>
  );
};

export default InformationTypesTable;
