import {DocumentInformationTypes, PolicyInformationType} from "../../../constants";
import {Select, TYPE} from "baseui/select";
import React from "react";
import {useInfoTypeSearch} from "../../../api";
import {intl} from "../../../util";

const FieldInformationType = (props: {
  informationType: DocumentInformationTypes,
  handleChange: Function
}) => {
  const [selectedInformationType, setSelectedInformationType] = React.useState();
  const [searchKeyword, setSearchKeyword, isLoading] = useInfoTypeSearch();
  const { informationType, handleChange } = props

  return (

    <Select
      autoFocus
      maxDropdownHeight="400px"
      searchable={true}
      type={TYPE.search}
      options={searchKeyword}
      placeholder={intl.informationTypeSearch}
      value={selectedInformationType}
      onInputChange={event => setSearchKeyword(event.currentTarget.value)}
      onChange={(params) => {
          setSelectedInformationType(params.value[0] as PolicyInformationType)
          handleChange({...informationType, informationTypeId: !params.value[0] ? '' : params.value[0].id})
      }}
      filterOptions={options => options}
      labelKey="name"
    />
  )
};

export default FieldInformationType;
