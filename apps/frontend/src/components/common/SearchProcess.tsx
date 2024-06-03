import { Process } from '../../constants'
import * as React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { useDebouncedState } from '../../util'
import { getProcessesByPurpose, searchProcess } from '../../api'
import { codelist, ListName } from '../../service/Codelist'
import { Block } from 'baseui/block'
import { Select, TYPE } from 'baseui/select'

type SearchProcessProps = {
  selectedProcess?: Process
  setSelectedProcess: Dispatch<SetStateAction<Process | undefined>>
}

const SearchProcess = (props: SearchProcessProps) => {
  const [processList, setProcessList] = React.useState<Process[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    ;(async () => {
      if (search && search.length > 2) {
        setLoading(true)
        const res = await searchProcess(search)
        let content = res.content
        const purposes = codelist.getCodes(ListName.PURPOSE).filter((c) => c.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
        const processesPromise: Promise<any>[] = []
        for (let i = 0; i < purposes.length; i++) {
          processesPromise.push(getProcessesByPurpose(purposes[i].code))
        }
        content = [...content, ...(await Promise.all(processesPromise)).map((value) => value.content).flatMap((value) => value)]
        content = content
          .map((v: Process) => {
            return { ...v, namePurpose: 'B' + v.number + ' ' + (v.purposes !== undefined ? v.purposes[0].shortName : '') + ': ' + v.name }
          })
          .filter((p1, index, self) => index === self.findIndex((p2) => p2.id === p1.id))


        setProcessList(content)
        setLoading(false)
      }
    })()
  }, [search])

  return (
    <Block width="100%">
      <Select
        options={processList}
        isLoading={isLoading}
        clearable
        searchable={true}
        noResultsMsg='Ingen'
        type={TYPE.search}
        maxDropdownHeight="400px"
        placeholder='Søk etter behandlinger'
        onInputChange={(event) => setSearch(event.currentTarget.value)}
        labelKey="namePurpose"
        value={
          props.selectedProcess
            ? [
                {
                  id: props.selectedProcess?.id,
                  namePurpose: (props.selectedProcess?.purposes !== undefined ? props.selectedProcess?.purposes[0].shortName : '') + ': ' + props.selectedProcess?.name,
                },
              ]
            : []
        }
        onChange={(params) => {
          props.setSelectedProcess(params.value[0] as Process)
        }}
      />
    </Block>
  )
}

export default SearchProcess
