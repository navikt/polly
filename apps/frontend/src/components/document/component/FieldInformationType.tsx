import { DocumentInfoTypeUse, InformationTypeShort } from '../../../constants'
import { Select, TYPE } from 'baseui/select'
import React from 'react'
import { useInfoTypeSearch } from '../../../api'
import { PLACEMENT } from 'baseui/popover'

const FieldInformationType = (props: { documentInformationType: DocumentInfoTypeUse; handleChange: Function }) => {
  const { documentInformationType, handleChange } = props
  const [searchKeyword, setSearchKeyword, isLoading] = useInfoTypeSearch()

  const [selectedInformationType, setSelectedInformationType] = React.useState<InformationTypeShort>(documentInformationType.informationType)

  return (
    <Select
      noResultsMsg='Ingen'
      isLoading={isLoading}
      maxDropdownHeight="400px"
      searchable={true}
      type={TYPE.search}
      options={searchKeyword}
      placeholder={selectedInformationType ? '' : 'Søk opplysningstyper'}
      overrides={{
        Popover: {
          props: {
            Body: {
              placement: PLACEMENT.bottom,
            },
          },
        },
      }}
      value={selectedInformationType as any}
      onInputChange={(event) => setSearchKeyword(event.currentTarget.value)}
      onChange={(params) => {
        setSelectedInformationType(params.value[0] as InformationTypeShort)
        handleChange({ ...documentInformationType, informationTypeId: !params.value[0] ? '' : params.value[0].id })
      }}
      filterOptions={(options) => options}
      labelKey="name"
    />
  )
}

export default FieldInformationType
