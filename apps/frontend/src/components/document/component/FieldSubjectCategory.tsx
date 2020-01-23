import React from "react";
import {Select, Value} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {DocumentTableRow} from "../../../constants";
import index from "../../Purpose/Accordion";

const FieldSubjectCategory = (props: { value?: string, rowData:DocumentTableRow, setRowData:Function, index:number }) => {
  const [value, setValue] = React.useState<Value>(props.value ? [{
    id: props.value,
    label: codelist.getShortname(ListName.SUBJECT_CATEGORY, props.value)
  }] : []);

  return (
    <Select
      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
      onChange={({value}) => {
        setValue(value);
        console.log(value);
        console.log(props.rowData);
        let newRowData = props.rowData;
        newRowData.categories = [...value];
        props.setRowData(newRowData,index);
      }}
      value={value}
      multi
    />
  )
};

export default FieldSubjectCategory;
