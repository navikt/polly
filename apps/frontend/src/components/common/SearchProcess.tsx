import { Select, TextField } from '@navikt/ds-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { getProcessesByPurpose, searchProcess } from '../../api/GetAllApi'
import { IPageResponse, IProcess } from '../../constants'
import { CodelistService, EListName, ICode } from '../../service/Codelist'
import { useDebouncedState } from '../../util'

type TSearchProcessProps = {
  selectedProcess?: IProcess
  setSelectedProcess: Dispatch<SetStateAction<IProcess | undefined>>
}

type TProcessWithNamePurpose = IProcess & { namePurpose: string }

const SearchProcess = (props: TSearchProcessProps) => {
  const { selectedProcess, setSelectedProcess } = props
  const [codelistUtils] = CodelistService()

  const [processList, setProcessList] = useState<TProcessWithNamePurpose[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchProcesses = async () => {
      if (search && search.length > 2) {
        setLoading(true)
        const response: IPageResponse<IProcess> = await searchProcess(search)
        let content: TProcessWithNamePurpose[] = response.content.map((process) => ({
          ...process,
          namePurpose:
            'B' +
            process.number +
            ' ' +
            (process.purposes !== undefined ? process.purposes[0].shortName : '') +
            ': ' +
            process.name,
        }))
        const purposes: ICode[] = codelistUtils
          .getCodes(EListName.PURPOSE)
          .filter((code: ICode) => code.shortName.toLowerCase().includes(search.toLowerCase()))
        const processesPromise: Promise<IPageResponse<IProcess>>[] = purposes.map((purpose) =>
          getProcessesByPurpose(purpose.code)
        )
        const additionalProcesses = (await Promise.all(processesPromise)).flatMap((result) =>
          result.content.map((process) => ({
            ...process,
            namePurpose:
              'B' +
              process.number +
              ' ' +
              (process.purposes !== undefined ? process.purposes[0].shortName : '') +
              ': ' +
              process.name,
          }))
        )
        content = [...content, ...additionalProcesses].filter(
          (p1, index, self) => index === self.findIndex((p2) => p2.id === p1.id)
        )
        setProcessList(content)
        setLoading(false)
      } else {
        setProcessList([])
      }
    }
    fetchProcesses()
  }, [search])

  return (
    <div className="w-full">
      <TextField
        label="Søk etter behandlinger"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Søk etter behandlinger"
        disabled={isLoading}
      />
      <Select
        label="Velg behandling"
        value={selectedProcess?.id ?? ''}
        onChange={(e) => {
          const selected = processList.find((p) => p.id === e.target.value)
          setSelectedProcess(selected)
        }}
        disabled={isLoading || processList.length === 0}
      >
        <option value="">Ingen</option>
        {processList.map((process) => (
          <option key={process.id} value={process.id}>
            {process.namePurpose}
          </option>
        ))}
      </Select>
    </div>
  )
}

export default SearchProcess
