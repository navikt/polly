import { Select, Value } from 'baseui/select'
import { useEffect, useState } from 'react'
import { DocumentInfoTypeUse } from '../../../constants'
import { Code, ListName, codelist } from '../../../service/Codelist'

const FieldSubjectCategory = (props: { documentInformationType: DocumentInfoTypeUse; handleChange: Function }) => {
  const { documentInformationType, handleChange } = props
  const [value, setValue] = useState<Value>(
    documentInformationType.subjectCategories.map((subjectCategory: Code) => {
      return { id: subjectCategory.code, label: subjectCategory.shortName }
    }),
  )

  useEffect(() => {
    handleChange({ ...documentInformationType, subjectCategories: [...value].map((category) => codelist.getCode(ListName.SUBJECT_CATEGORY, category.id as string)?.code) })
  }, [])

  return (
    <Select
      options={codelist.getParsedOptions(ListName.SUBJECT_CATEGORY)}
      onChange={({ value }) => {
        setValue(value)
        handleChange({ ...documentInformationType, subjectCategories: [...value].map((category) => codelist.getCode(ListName.SUBJECT_CATEGORY, category.id as string)?.code) })
      }}
      value={value}
      multi
    />
  )
}

export default FieldSubjectCategory
