import React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {DocumentInformationTypes} from "../../../constants";
import {FieldArrayRenderProps} from "formik";

const FieldSubjectCategory = (props: {
  index:number,
  arrayHelpers:FieldArrayRenderProps}) => {

  const { arrayHelpers, index } = props

  const [value, setValue] = React.useState<Value>();

  // arrayHelpers.form.values.informationTypes[index] ? [{
  //   id: (arrayHelpers.form.values.informationTypes[index] as DocumentInformationTypes).subjectCategories,
  //   label: codelist.getShortname(ListName.SUBJECT_CATEGORY, (arrayHelpers.form.values.informationTypes[index] as DocumentInformationTypes).subjectCategories)
  // }] : []
  return (
    <Select
      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
      onChange={({value}) => {
        setValue(value);

        let  informationType = props.arrayHelpers.form.values.informationTypes[props.index] as DocumentInformationTypes;
        // @ts-ignore
        informationType.subjectCategories = [...value].map(category=>category.id);
        props.arrayHelpers.replace(props.index,informationType);

      }}
      value={value}
      multi
    />
  )
};

export default FieldSubjectCategory;
