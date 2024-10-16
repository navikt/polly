import { PLACEMENT } from 'baseui/popover'
import { OnChangeParams, Select, TYPE } from 'baseui/select'
import { ChangeEvent, useState } from 'react'
import { useInfoTypeSearch } from '../../../api/GetAllApi'
import { IDocumentInfoTypeUse, IInformationTypeShort } from '../../../constants'

const FieldInformationType = (props: {
  documentInformationType: IDocumentInfoTypeUse
  handleChange: (documentInformationType: IDocumentInfoTypeUse) => void
}) => {
  const { documentInformationType, handleChange } = props
  const [searchKeyword, setSearchKeyword, isLoading] = useInfoTypeSearch()
  const [selectedInformationType, setSelectedInformationType] = useState<IInformationTypeShort>(
    documentInformationType.informationType
  )

  return (
    <Select
      noResultsMsg="Ingen"
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
      onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
        setSearchKeyword(event.currentTarget.value)
      }
      onChange={(params: OnChangeParams) => {
        setSelectedInformationType(params.value[0] as IInformationTypeShort)
        handleChange({
          ...documentInformationType,
          informationTypeId:
            params.value[0] && params.value[0].id ? params.value[0].id.toString() : '',
        })
      }}
      filterOptions={(options) => options}
      labelKey="name"
    />
  )
}

export default FieldInformationType
