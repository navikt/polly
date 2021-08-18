import React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {DocumentInfoTypeUse} from "../../../constants";

const FieldSubjectCategory = (props: {
  documentInformationType: DocumentInfoTypeUse,
  handleChange: Function
}) => {
  const {documentInformationType, handleChange} = props
  const [value, setValue] = React.useState<Value>(documentInformationType.subjectCategories.map(sc => {
    return {id: sc.code, label: sc.shortName}
  }));

  return (
    <Select
      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
      onChange={({value}) => {
        setValue(value);
        handleChange({...documentInformationType, subjectCategories: [...value].map(category => codelist.getCode(ListName.SUBJECT_CATEGORY, category.id as string)?.code)})
      }}
      value={value}
      multi
    />
  )
};

export default FieldSubjectCategory;
