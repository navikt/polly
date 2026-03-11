import { UNSAFE_Combobox } from '@navikt/ds-react'
import { useEffect, useMemo, useState } from 'react'
import { IDocumentInfoTypeUse, IDocumentInformationTypes } from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'

const FieldSubjectCategory = (props: {
  documentInformationType: IDocumentInfoTypeUse
  handleChange: (values: IDocumentInformationTypes) => void
  codelistUtils: ICodelistProps
}) => {
  const { documentInformationType, handleChange, codelistUtils } = props

  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    documentInformationType.subjectCategories.map((subjectCategory: ICode) => ({
      value: subjectCategory?.code,
      label: subjectCategory?.shortName,
    }))
  )

  const comboboxOptions = useMemo(
    () =>
      codelistUtils.getParsedOptions(EListName.SUBJECT_CATEGORY).map((o: any) => ({
        label: o.label,
        value: o.id,
      })),
    [codelistUtils]
  )

  useEffect(() => {
    handleChange({
      ...documentInformationType,
      subjectCategories: selected.map((category) => category.value),
    })
  }, [])

  return (
    <UNSAFE_Combobox
      label="Subjektkategori"
      hideLabel
      options={comboboxOptions}
      filteredOptions={comboboxOptions}
      isMultiSelect
      selectedOptions={selected}
      onToggleSelected={(optionValue, isSelected) => {
        const option = comboboxOptions.find((o) => o.value === optionValue)
        if (!option) return

        const next = isSelected
          ? [...selected, option]
          : selected.filter((s) => s.value !== optionValue)

        setSelected(next)
        handleChange({
          ...documentInformationType,
          subjectCategories: next.map((category) => category.value),
        })
      }}
    />
  )
}

export default FieldSubjectCategory
