import { Tag, VARIANT } from 'baseui/tag'
import { FormikProps } from 'formik'
import { searchDocuments } from '../../api'
import { IDocument } from '../../constants'
import CustomSearchSelect from './AsyncSelectComponents'

type TSelectDocumentProps = {
  form: FormikProps<any>
  handleChange: (document: IDocument | undefined) => void
}

const SelectDocument = (props: TSelectDocumentProps) => {
  const { handleChange, form } = props

  const useSearchDocumentOption = async (searchParam: string) => {
    if (searchParam && searchParam.length > 2) {
      const dokumenter: IDocument[] = (await searchDocuments(searchParam)).content

      const searchResult = dokumenter.map((dokument) => {
        return {
          ...dokument,
          value: dokument.id,
          label: dokument.name,
        }
      })

      return searchResult
    }
    return []
  }

  return (
    <div className="w-full">
      <CustomSearchSelect
        ariaLabel="Søk etter dokumenter"
        placeholder=""
        loadOptions={useSearchDocumentOption}
        onChange={handleChange}
      />

      {form.values.document && (
        <Tag
          variant={VARIANT.outlined}
          onActionClick={() => form.setFieldValue('document', null)}
          overrides={{
            Text: {
              style: {
                maxWidth: '550px',
              },
            },
          }}
        >
          {form.values.document.name}
        </Tag>
      )}
    </div>
  )
}

export default SelectDocument
