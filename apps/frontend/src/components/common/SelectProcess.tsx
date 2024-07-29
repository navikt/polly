import { Select, TYPE } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import * as React from 'react'
import { getProcessesByPurpose, searchProcess } from '../../api'
import { DisclosureFormValues, Process } from '../../constants'
import { ListName, codelist } from '../../service/Codelist'
import { useDebouncedState } from '../../util'
import { renderTagList } from './TagList'

type SelectProcessProps = {
  formikBag: FormikProps<DisclosureFormValues>
}

const SelectProcess = (props: SelectProcessProps) => {
  const [processList, setProcessList] = React.useState<Process[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = React.useState<boolean>(false)
  const { formikBag } = props

  React.useEffect(() => {
    ;(async () => {
      if (search && search.length > 2) {
        setLoading(true)
        let res = (await searchProcess(search)).content
        const purposes = codelist.getCodes(ListName.PURPOSE).filter((c) => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)

        const processesPromise: Promise<any>[] = []

        for (let i = 0; i < purposes.length; i++) {
          processesPromise.push(getProcessesByPurpose(purposes[i].code))
        }

        res = [...res, ...(await Promise.all(processesPromise)).map((value) => value.content).flatMap((value) => value)]

        res = res
          .map((v: Process) => {
            return { ...v, namePurpose: 'B' + v.number + ' ' + (v.purposes !== undefined ? v.purposes[0].shortName : '') + ': ' + v.name }
          })
          .filter((p1, index, self) => index === self.findIndex((p2) => p2.id === p1.id))
          .filter((p1) => !formikBag.values.processes.map((value) => value.id).includes(p1.id))

        setProcessList(res)
        setLoading(false)
      }
    })()
  }, [search])

  return (
    <FieldArray
      name="processes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <Select
              options={processList}
              isLoading={isLoading}
              clearable
              searchable={true}
              noResultsMsg="Ingen"
              type={TYPE.search}
              maxDropdownHeight="400px"
              placeholder="Søk behandlinger"
              onInputChange={(event) => setSearch(event.currentTarget.value)}
              labelKey="namePurpose"
              onChange={({ value }) => arrayHelpers.form.setFieldValue('processes', [...props.formikBag.values.processes, ...value.map((v) => v)])}
            />
          </div>

          <div>
            {renderTagList(
              formikBag.values.processes.map((p) => 'B' + p.number + ' ' + p.purposes[0].shortName + ': ' + p.name),
              arrayHelpers,
            )}
          </div>
        </div>
      )}
    />
  )
}

export default SelectProcess
