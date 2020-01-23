import {DocumentTableRow, PolicyInformationType} from "../../../constants";
import {Select, TYPE} from "baseui/select";
import React from "react";
import index from "../../Purpose/Accordion";
import {useInfoTypeSearch} from "../../../api";

const FieldInformationType = (props: {
  setValue: Function,
  rowData:DocumentTableRow,
  setRowData:Function,
  index:number
}) => {
  const [selectedInformationType, setSelectedInformationType] = React.useState();
  const [infoTypeSearchResult, setInfoTypeSearchResult, infoTypeSearchLoading] = useInfoTypeSearch();
  return(
    <Select
      autoFocus
      maxDropdownHeight="400px"
      searchable={true}
      type={TYPE.search}
      options={infoTypeSearchResult}
      placeholder="Søk opplysningstyper"
      value={selectedInformationType as any}
      onInputChange={event => setInfoTypeSearchResult(event.currentTarget.value)}
      onChange={(params) => {
        let infoType = params.value[0] as PolicyInformationType;
        console.log(infoType);
        console.log(props.rowData)
        props.rowData.informationTypes = infoType;
        props.setRowData(props.rowData,index);
        setSelectedInformationType(infoType)
        // console.log(params);
      }}
      filterOptions={options => options}
      labelKey="name"
    />
  )
};

export default FieldInformationType;
