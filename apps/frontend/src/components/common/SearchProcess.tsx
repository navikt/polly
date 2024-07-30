import { Select, TYPE } from 'baseui/select'
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getProcessesByPurpose, searchProcess } from '../../api'
import { Process } from '../../constants'
import { ListName, codelist } from '../../service/Codelist'
import { useDebouncedState } from '../../util'

type SearchProcessProps = {
  selectedProcess?: Process
  setSelectedProcess: Dispatch<SetStateAction<Process | undefined>>
}

const SearchProcess = (props: SearchProcessProps) => {
  const { selectedProcess, setSelectedProcess } = props
  const [processList, setProcessList] = useState<Process[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (search && search.length > 2) {
        setLoading(true)
        const result = await searchProcess(search)
        let content = result.content
        const purposes = codelist.getCodes(ListName.PURPOSE).filter((code) => code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
        const processesPromise: Promise<any>[] = []
        for (let i = 0; i < purposes.length; i++) {
          processesPromise.push(getProcessesByPurpose(purposes[i].code))
        }
        content = [...content, ...(await Promise.all(processesPromise)).map((value) => value.content).flatMap((value) => value)]
        content = content
          .map((process: Process) => {
            return { ...process, namePurpose: 'B' + process.number + ' ' + (process.purposes !== undefined ? process.purposes[0].shortName : '') + ': ' + process.name }
          })
          .filter((p1: Process, index, self) => index === self.findIndex((p2) => p2.id === p1.id))

        setProcessList(content)
        setLoading(false)
      }
    })()
  }, [search])

  return (
    <div className="w-full">
      <Select
        options={processList}
        isLoading={isLoading}
        clearable
        searchable={true}
        noResultsMsg="Ingen"
        type={TYPE.search}
        maxDropdownHeight="400px"
        placeholder="Søk etter behandlinger"
        onInputChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.currentTarget.value)}
        labelKey="namePurpose"
        value={
          selectedProcess
            ? [
                {
                  id: selectedProcess?.id,
                  namePurpose: (selectedProcess?.purposes !== undefined ? selectedProcess?.purposes[0].shortName : '') + ': ' + selectedProcess?.name,
                },
              ]
            : []
        }
        onChange={(params) => {
          setSelectedProcess(params.value[0] as Process)
        }}
      />
    </div>
  )
}

export default SearchProcess
