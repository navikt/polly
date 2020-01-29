import {DocumentInformationTypes, PolicyInformationType} from "../../../constants";
import {Select, TYPE} from "baseui/select";
import React from "react";
import index from "../../Purpose/Accordion";
import {useInfoTypeSearch} from "../../../api";
import {FieldArrayRenderProps} from "formik";
import {DocumentTableRow} from "../common/model/DocumentTableRow";
import {intl} from "../../../util";

const FieldInformationType = (props: {
  setValue: Function,
  rowData: DocumentTableRow,
  setRowData: Function,
  index: number,
  arrayHelpers: FieldArrayRenderProps
}) => {
  const [selectedInformationType, setSelectedInformationType] = React.useState();
  const [searchKeyword, setSearchKeyword] = useInfoTypeSearch();
  return (

    <Select
      autoFocus
      maxDropdownHeight="400px"
      searchable={true}
      type={TYPE.search}
      options={searchKeyword}
      placeholder={intl.informationTypeSearch}
      value={selectedInformationType as any}
      onInputChange={event => setSearchKeyword(event.currentTarget.value)}
      onChange={(params) => {
        let infoType = params.value[0] as PolicyInformationType;
        props.rowData.informationTypes = infoType;
        props.setRowData(props.rowData, index);
        setSelectedInformationType(infoType)

        let  informationType = props.arrayHelpers.form.values.informationTypes[props.index] as DocumentInformationTypes;
        informationType.informationTypeId = infoType.id;
        props.arrayHelpers.replace(props.index,informationType);
      }}
      filterOptions={options => options}
      labelKey="name"
    />
  )
};

export default FieldInformationType;
