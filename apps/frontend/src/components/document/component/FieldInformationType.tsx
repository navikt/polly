import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useMemo, useRef, useState } from 'react'
import { useInfoTypeSearch } from '../../../api/GetAllApi'
import { IDocumentInfoTypeUse, IInformationTypeShort } from '../../../constants'

const FieldInformationType = (props: {
  documentInformationType: IDocumentInfoTypeUse
  handleChange: (documentInformationType: IDocumentInfoTypeUse) => void
}) => {
  const { documentInformationType, handleChange } = props
  const [searchResult, , setSearchKeyword, isLoading] = useInfoTypeSearch()
  const [selectedInformationType, setSelectedInformationType] = useState<IInformationTypeShort>(
    documentInformationType.informationType
  )
  const [value, setValue] = useState<string>(documentInformationType.informationType?.name || '')
  const justSelectedRef = useRef(false)

  const options = useMemo(
    () => searchResult.map((it) => ({ value: it.id, label: it.name })),
    [searchResult]
  )

  const selectedOptions = useMemo(
    () =>
      selectedInformationType?.id
        ? [{ value: selectedInformationType.id, label: selectedInformationType.name }]
        : [],
    [selectedInformationType]
  )

  return (
    <UNSAFE_Combobox
      label=""
      hideLabel
      placeholder={selectedInformationType?.id ? '' : 'Søk opplysningstyper'}
      isLoading={isLoading}
      options={options}
      value={value}
      onChange={(newValue) => {
        if (justSelectedRef.current) {
          justSelectedRef.current = false
          return
        }

        if (!newValue && selectedInformationType?.id) {
          return
        }

        setValue(newValue)
        setSearchKeyword(newValue)

        if (selectedInformationType?.name && newValue !== selectedInformationType.name) {
          setSelectedInformationType({} as IInformationTypeShort)
          handleChange({
            ...documentInformationType,
            informationTypeId: '',
          })
        }
      }}
      selectedOptions={selectedOptions}
      onToggleSelected={(optionValue, isSelected) => {
        if (!isSelected) {
          setSelectedInformationType({} as IInformationTypeShort)
          setValue('')
          handleChange({
            ...documentInformationType,
            informationTypeId: '',
          })
          return
        }

        const picked = searchResult.find((it) => it.id === optionValue)
        if (!picked) return

        justSelectedRef.current = true
        setSelectedInformationType(picked)
        setValue(picked.name)
        handleChange({
          ...documentInformationType,
          informationTypeId: picked.id ? picked.id.toString() : '',
        })
      }}
    />
  )
}

export default FieldInformationType
