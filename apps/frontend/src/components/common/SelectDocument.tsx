import { Chips } from '@navikt/ds-react'
import { FormikProps } from 'formik'
import { searchDocuments } from '../../api/GetAllApi'
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
        <div className="mt-2 flex flex-wrap gap-2" style={{ maxWidth: '550px' }}>
          <Chips.Removable onClick={() => form.setFieldValue('document', null)}>
            {form.values.document.name}
          </Chips.Removable>
        </div>
      )}
    </div>
  )
}

export default SelectDocument
