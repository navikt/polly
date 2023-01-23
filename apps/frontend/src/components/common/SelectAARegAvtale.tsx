import { Block } from 'baseui/block'
import { Select, TYPE, Option, Value } from 'baseui/select'
import { FieldArray, FormikProps } from 'formik'
import * as React from 'react'
import { useInfoTypeSearch } from '../../api'
import { useAaregAvtaleSearch } from '../../api/AaregAvtaleApi'
import { DisclosureFormValues } from '../../constants'
import { intl } from '../../util'
import { renderTagList } from './TagList'

type SelectAARegAvtale = {
  formikBag: FormikProps<DisclosureFormValues>
}

const SelectAARegAvtale = (props: SelectAARegAvtale) => {
  const [aaregAvtaleSearchResult, setAaregAvtaleSearch, aaregAvtaleSearchLoading] = useAaregAvtaleSearch()
  const { formikBag } = props
  const [aaregAvtaleValues, setAaregAvtaleValue] = React.useState<Option>(formikBag.values.aaregContractIds ? [{id: formikBag.values.aaregContractIds, label: formikBag.values.aaregContractIds}] : []);

  return (<FieldArray
    name="aaregContractIds"
    render={arrayHelpers => (
      <Block width="100%">
        <Block width="100%">
          <Select
            noResultsMsg={intl.emptyTable}
            maxDropdownHeight="400px"
            searchable={true}
            type={TYPE.search}
            options={aaregAvtaleSearchResult}
            placeholder={intl.definitionWrite}
            value={aaregAvtaleValues as Value}
            onInputChange={event => setAaregAvtaleSearch(event.currentTarget.value)}
            onChange={(params) => {
              let aaregAvtale = params.value.length ? params.value[0] : undefined
              setAaregAvtaleValue(aaregAvtale ? [aaregAvtale as Option] : [])
              formikBag.setFieldValue('aaregContractIds', aaregAvtale ? aaregAvtale.id : undefined)
            }}
            error={!!formikBag.errors.aaregContractIds && !!formikBag.submitCount}
            isLoading={aaregAvtaleSearchLoading}
          />
        </Block>
        
      </Block>
    )}
  />)
}
export default SelectAARegAvtale