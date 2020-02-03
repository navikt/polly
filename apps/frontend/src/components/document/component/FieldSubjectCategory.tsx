import React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {DocumentInformationTypes} from "../../../constants";
import {FieldArrayRenderProps} from "formik";
import {DocumentTableRow} from "../common/model/DocumentTableRow";

const FieldSubjectCategory = (props: {
  value?: string,
  rowData:DocumentTableRow,
  setRowData:Function,
  index:number,
  arrayHelpers:FieldArrayRenderProps}) => {

  const [value, setValue] = React.useState<Value>(props.value ? [{
    id: props.value,
    label: codelist.getShortname(ListName.SUBJECT_CATEGORY, props.value)
  }] : []);

  return (
    <Select
      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
      onChange={({value}) => {
        setValue(value);
        let newRowData = props.rowData;
        newRowData.categories = [...value];
        props.setRowData(newRowData,props.index);

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
