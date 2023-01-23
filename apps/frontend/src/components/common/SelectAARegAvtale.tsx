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


  //TODO UPDATE AAREG AVTALE API TO BE LIKE INFORMATIONTYPESAPI ALSO SELECTOR TO BE LIKE SELECTINFORMATIONTYPES
  return (<FieldArray
    name="aaregContracts"
    render={arrayHelpers => (
      <Block width="100%">
        <Block width="100%">
        <Select
              options={aaregAvtaleSearchResult}
              clearable
              searchable={true}
              noResultsMsg={intl.emptyTable}
              type={TYPE.search}
              maxDropdownHeight="400px"
              placeholder={intl.aaregAvtale}
              onInputChange={event => setAaregAvtaleSearch(event.currentTarget.value)}
              labelKey="label"
              onChange={({value}) => (
                arrayHelpers.form.setFieldValue('aaregContracts',
                  formikBag.values.informationTypes ? [...formikBag.values.informationTypes, ...value.map(v => v)] : value.map(v => v))
              )}
            />
        </Block>
        {formikBag.values.aaregContracts && <Block>{renderTagList(formikBag.values.aaregContracts.map(i => i.avtalenummer + ' - ' + i.virksomhet), arrayHelpers)}</Block>}
      </Block>
    )}
  />)
}
export default SelectAARegAvtale