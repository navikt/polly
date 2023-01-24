import { Block } from 'baseui/block'
import { Select, TYPE } from 'baseui/select'
import { FieldArray, FormikProps } from 'formik'
import * as React from 'react'
import { useAaregAvtaleSearch } from '../../api/AaregAvtaleApi'
import { DisclosureFormValues } from '../../constants'
import { intl } from '../../util'
import { renderTagList } from './TagList'

type SelectAARegAvtaleProps = {
  formikBag: FormikProps<DisclosureFormValues>
}

const SelectAARegAvtale = (props: SelectAARegAvtaleProps) => {
  const [aaregAvtaleSearchResult, setAaregAvtaleSearch] = useAaregAvtaleSearch()
  const { formikBag } = props

  return (<FieldArray
    name="aaregContracts"
    render={arrayHelpers => (
      <Block width="100%">
        <Block width="100%">
        <Select
              options={aaregAvtaleSearchResult.filter(i => !formikBag.values.aaregContracts?.map(value => value.avtalenummer).includes(i.avtalenummer)).map(aaregAvtale => {
                return {id: aaregAvtale.avtalenummer, label: aaregAvtale.avtalenummer + ' - ' + aaregAvtale.virksomhet, ...aaregAvtale}
              })}
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
                  formikBag.values.aaregContracts ? [...formikBag.values.aaregContracts, ...value.map(v => v)] : value.map(v => v))
              )}
            />
        </Block>
        {formikBag.values.aaregContracts && <Block>{renderTagList(formikBag.values.aaregContracts.map(i => i.avtalenummer + ' - ' + i.virksomhet), arrayHelpers)}</Block>}
      </Block>
    )}
  />)
}
export default SelectAARegAvtale