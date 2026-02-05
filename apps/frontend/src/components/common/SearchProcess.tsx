import { UNSAFE_Combobox } from '@navikt/ds-react'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { getProcessesByPurpose, searchProcess } from '../../api/GetAllApi'
import { IPageResponse, IProcess } from '../../constants'
import { CodelistService, EListName, ICode } from '../../service/Codelist'
import { useDebouncedState } from '../../util'

type TSearchProcessProps = {
  selectedProcess?: IProcess
  setSelectedProcess: Dispatch<SetStateAction<IProcess | undefined>>
}

const SearchProcess = (props: TSearchProcessProps) => {
  const { selectedProcess, setSelectedProcess } = props
  const [codelistUtils] = CodelistService()

  const [processList, setProcessList] = useState<IProcess[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = useState<boolean>(false)

  const comboboxOptions = useMemo(
    () =>
      processList.map((process) => ({
        label: (process as any).namePurpose ?? process.name,
        value: process.id,
      })),
    [processList]
  )

  const selectedLabel = useMemo(() => {
    if (!selectedProcess) return ''
    return (
      (selectedProcess.purposes !== undefined ? selectedProcess.purposes[0].shortName : '') +
      ': ' +
      selectedProcess.name
    )
  }, [selectedProcess])

  useEffect(() => {
    ;(async () => {
      if (search && search.length > 2) {
        setLoading(true)
        const response: IPageResponse<IProcess> = await searchProcess(search)
        let content: IProcess[] = response.content
        const purposes: ICode[] = codelistUtils
          .getCodes(EListName.PURPOSE)
          .filter((code: ICode) => code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
        const processesPromise: Promise<any>[] = []
        for (let i = 0; i < purposes.length; i++) {
          processesPromise.push(getProcessesByPurpose(purposes[i].code))
        }
        content = [
          ...content,
          ...(await Promise.all(processesPromise))
            .map((value) => value.content)
            .flatMap((value) => value),
        ]
        content = content
          .map((process: IProcess) => {
            return {
              ...process,
              namePurpose:
                'B' +
                process.number +
                ' ' +
                (process.purposes !== undefined ? process.purposes[0].shortName : '') +
                ': ' +
                process.name,
            }
          })
          .filter(
            (p1: IProcess, index: number, self) => index === self.findIndex((p2) => p2.id === p1.id)
          )

        setProcessList(content)
        setLoading(false)
      }
    })()
  }, [search])

  return (
    <div className="w-full">
      <UNSAFE_Combobox
        label="Søk etter behandlinger"
        hideLabel
        options={comboboxOptions}
        filteredOptions={comboboxOptions}
        isLoading={isLoading}
        value={search}
        onChange={(value) => {
          setSearch(value)
          if (selectedProcess && value !== selectedLabel) {
            setSelectedProcess(undefined)
          }
        }}
        selectedOptions={
          selectedProcess
            ? [
                {
                  label: selectedLabel,
                  value: selectedProcess.id,
                },
              ]
            : []
        }
        onToggleSelected={(optionValue, isSelected) => {
          if (!isSelected) {
            setSelectedProcess(undefined)
            return
          }

          const selected = processList.find((p) => p.id === optionValue)
          if (selected) {
            setSelectedProcess(selected)
          }
        }}
      />
    </div>
  )
}

export default SearchProcess
