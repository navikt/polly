import { Select, Value } from 'baseui/select'
import { useEffect, useState } from 'react'
import { IDocumentInfoTypeUse } from '../../../constants'
import { EListName, ICode, codelist } from '../../../service/Codelist'

const FieldSubjectCategory = (props: {
  documentInformationType: IDocumentInfoTypeUse
  handleChange: Function
}) => {
  const { documentInformationType, handleChange } = props
  const [value, setValue] = useState<Value>(
    documentInformationType.subjectCategories.map((subjectCategory: ICode) => {
      return { id: subjectCategory.code, label: subjectCategory.shortName }
    })
  )

  useEffect(() => {
    handleChange({
      ...documentInformationType,
      subjectCategories: [...value].map(
        (category) => codelist.getCode(EListName.SUBJECT_CATEGORY, category.id as string)?.code
      ),
    })
  }, [])

  return (
    <Select
      options={codelist.getParsedOptions(EListName.SUBJECT_CATEGORY)}
      onChange={({ value }) => {
        setValue(value)
        handleChange({
          ...documentInformationType,
          subjectCategories: [...value].map(
            (category) => codelist.getCode(EListName.SUBJECT_CATEGORY, category.id as string)?.code
          ),
        })
      }}
      value={value}
      multi
    />
  )
}

export default FieldSubjectCategory
