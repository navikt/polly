import { Select, Value } from 'baseui/select'
import { useEffect, useState } from 'react'
import { IDocumentInfoTypeUse, IDocumentInformationTypes } from '../../../constants'
import { EListName, ICode, ICodelistProps } from '../../../service/Codelist'

const FieldSubjectCategory = (props: {
  documentInformationType: IDocumentInfoTypeUse
  handleChange: (values: IDocumentInformationTypes) => void
  codelistUtils: ICodelistProps
}) => {
  const { documentInformationType, handleChange, codelistUtils } = props

  const [value, setValue] = useState<Value>(
    documentInformationType.subjectCategories.map((subjectCategory: ICode) => {
      return { id: subjectCategory?.code, label: subjectCategory?.shortName }
    })
  )

  useEffect(() => {
    handleChange({
      ...documentInformationType,
      subjectCategories: [...value].map((category) => category.id as string),
    })
  }, [])

  return (
    <Select
      options={codelistUtils.getParsedOptions(EListName.SUBJECT_CATEGORY)}
      onChange={({ value }) => {
        setValue(value)
        handleChange({
          ...documentInformationType,
          subjectCategories: [...value].map((category) => category.id as string),
        })
      }}
      value={value}
      multi
    />
  )
}

export default FieldSubjectCategory
