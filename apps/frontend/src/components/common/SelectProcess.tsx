import * as React from 'react'
import { DisclosureFormValues, Process, ProcessShort } from '../../constants';
import { intl, useDebouncedState } from '../../util';
import { searchProcess } from '../../api';
import { Select, TYPE } from 'baseui/select';
import { FieldArray, FormikProps } from 'formik';
import { Block } from 'baseui/block';
import { renderTagList } from './TagList';

type SelectProcessProps = {
    formikBag: FormikProps<DisclosureFormValues>
}

const SelectProcess = (props: SelectProcessProps) => {
    const [processList, setProcessList] = React.useState<Process[]>([])
    const [search, setSearch] = useDebouncedState<string>('', 400)
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const { formikBag } = props

    React.useEffect(() => {
        (async () => {
            if (search && search.length > 2) {
                setLoading(true)
                const res = await searchProcess(search)
                console.log(res, "REEEESSSSSSSS")
                setProcessList(res.content)
                setLoading(false)
            }
        })()
    }, [search])

    return (
        <FieldArray
            name="processes"
            render={arrayHelpers => (
                <Block width="100%">
                    <Block width="100%">
                        <Select
                            options={processList}
                            isLoading={isLoading}
                            clearable
                            searchable={true}
                            noResultsMsg={intl.emptyTable}
                            type={TYPE.search}
                            maxDropdownHeight="400px"
                            placeholder={intl.searchProcess}
                            onInputChange={event => setSearch(event.currentTarget.value)}
                            labelKey="name"
                            onChange={({ value }) => arrayHelpers.form.setFieldValue('processes', [...props.formikBag.values.processes, ...value.map(v => v)])}
                        />
                    </Block>
                   
                    <Block>{renderTagList(formikBag.values.processes.map(p => p.name), arrayHelpers)}</Block>
                </Block>
            )}
        />

    )
}

export default SelectProcess