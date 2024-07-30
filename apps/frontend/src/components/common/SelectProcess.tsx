import { Select, TYPE } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'
import { getProcessesByPurpose, searchProcess } from '../../api'
import { DisclosureFormValues, Process, ProcessShort } from '../../constants'
import { ListName, codelist } from '../../service/Codelist'
import { useDebouncedState } from '../../util'
import { renderTagList } from './TagList'

type SelectProcessProps = {
  formikBag: FormikProps<DisclosureFormValues>
}

const SelectProcess = (props: SelectProcessProps) => {
  const { formikBag } = props
  const [processList, setProcessList] = useState<Process[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (search && search.length > 2) {
        setLoading(true)
        let result = (await searchProcess(search)).content
        const purposes = codelist.getCodes(ListName.PURPOSE).filter((c) => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)

        const processesPromise: Promise<any>[] = []

        for (let i = 0; i < purposes.length; i++) {
          processesPromise.push(getProcessesByPurpose(purposes[i].code))
        }

        result = [...result, ...(await Promise.all(processesPromise)).map((value) => value.content).flatMap((value) => value)]

        result = result
          .map((purpose: Process) => {
            return { ...purpose, namePurpose: 'B' + purpose.number + ' ' + (purpose.purposes !== undefined ? purpose.purposes[0].shortName : '') + ': ' + purpose.name }
          })
          .filter((p1: Process, index, self) => index === self.findIndex((p2) => p2.id === p1.id))
          .filter((p1: Process) => !formikBag.values.processes.map((value: ProcessShort) => value.id).includes(p1.id))

        setProcessList(result)
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
              onInputChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.currentTarget.value)}
              labelKey="namePurpose"
              onChange={({ value }) => arrayHelpers.form.setFieldValue('processes', [...formikBag.values.processes, ...value.map((value) => value)])}
            />
          </div>

          <div>
            {renderTagList(
              formikBag.values.processes.map((process: ProcessShort) => 'B' + process.number + ' ' + process.purposes[0].shortName + ': ' + process.name),
              arrayHelpers,
            )}
          </div>
        </div>
      )}
    />
  )
}

export default SelectProcess
