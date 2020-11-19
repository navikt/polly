import { Block } from 'baseui/block'
import { Select, TYPE } from 'baseui/select'
import { FieldArray, FormikProps } from 'formik'
import * as React from 'react'
import { useInfoTypeSearch } from '../../api'
import { DisclosureFormValues } from '../../constants'
import { intl } from '../../util'
import { renderTagList } from './TagList'

type SelectInformationTypesProps = {
    formikBag: FormikProps<DisclosureFormValues>
}

const SelectInformationTypes = (props: SelectInformationTypesProps) => {
    const [infoTypeSearchResult, setInfoTypeSearch] = useInfoTypeSearch()
    const { formikBag } = props

    return (
        <FieldArray
            name="informationTypes"
            render={arrayHelpers => (
                <Block width="100%">
                    <Block width="100%">
                        <Select
                            options={infoTypeSearchResult}
                            clearable
                            searchable={true}
                            noResultsMsg={intl.emptyTable}
                            type={TYPE.search}
                            maxDropdownHeight="400px"
                            placeholder={intl.informationTypes}
                            onInputChange={event => setInfoTypeSearch(event.currentTarget.value)}
                            labelKey="name"
                            onChange={({ value }) =>( 
                                arrayHelpers.form.setFieldValue('informationTypes', 
                                    formikBag.values.informationTypes ? [...formikBag.values.informationTypes , ...value.map(v => v)] : value.map(v => v)) 
                            )}
                        />
                    </Block>
                   
                    {formikBag.values.informationTypes && <Block>{renderTagList(formikBag.values.informationTypes.map(i => i.name), arrayHelpers)}</Block>}
                </Block>
            )}
        />
    )
}

export default SelectInformationTypes