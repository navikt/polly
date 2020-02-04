import React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {DocumentInformationTypes} from "../../../constants";

const FieldSubjectCategory = (props: {
  documentInformationType: DocumentInformationTypes,
  handleChange:Function
}) => {
  const { documentInformationType, handleChange } = props
  const [value, setValue] = React.useState<Value>();

  return (
    <Select
      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
      onChange={({value}) => {
        setValue(value);
        handleChange({...documentInformationType, subjectCategories: [...value].map(category=>category.id)})
      }}
      value={value}
      multi
    />
  )
};

export default FieldSubjectCategory;
