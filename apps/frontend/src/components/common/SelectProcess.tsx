import { Select, TYPE } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ChangeEvent, useEffect, useState } from 'react'
import { getProcessesByPurpose, searchProcess } from '../../api'
import { IDisclosureFormValues, IProcess, IProcessShort } from '../../constants'
import { EListName, ICode, codelist } from '../../service/Codelist'
import { useDebouncedState } from '../../util'
import { renderTagList } from './TagList'

type TSelectProcessProps = {
  formikBag: FormikProps<IDisclosureFormValues>
}

const SelectProcess = (props: TSelectProcessProps) => {
  const { formikBag } = props
  const [processList, setProcessList] = useState<IProcess[]>([])
  const [search, setSearch] = useDebouncedState<string>('', 400)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (search && search.length > 2) {
        setLoading(true)
        let response: IProcess[] = (await searchProcess(search)).content
        const purposes: ICode[] = codelist
          .getCodes(EListName.PURPOSE)
          .filter((code: ICode) => code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0)

        const processesPromise: Promise<any>[] = []

        for (let i = 0; i < purposes.length; i++) {
          processesPromise.push(getProcessesByPurpose(purposes[i].code))
        }

        response = [
          ...response,
          ...(await Promise.all(processesPromise))
            .map((value) => value.content)
            .flatMap((value) => value),
        ]

        response = response
          .map((purpose: IProcess) => {
            return {
              ...purpose,
              namePurpose:
                'B' +
                purpose.number +
                ' ' +
                (purpose.purposes !== undefined ? purpose.purposes[0].shortName : '') +
                ': ' +
                purpose.name,
            }
          })
          .filter(
            (p1: IProcess, index: number, self) => index === self.findIndex((p2) => p2.id === p1.id)
          )
          .filter(
            (p1: IProcess) =>
              !formikBag.values.processes.map((value: IProcessShort) => value.id).includes(p1.id)
          )

        setProcessList(response)
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
              onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearch(event.currentTarget.value)
              }
              labelKey="namePurpose"
              onChange={({ value }) =>
                arrayHelpers.form.setFieldValue('processes', [
                  ...formikBag.values.processes,
                  ...value.map((value) => value),
                ])
              }
            />
          </div>

          <div>
            {renderTagList(
              formikBag.values.processes.map(
                (process: IProcessShort) =>
                  'B' + process.number + ' ' + process.purposes[0].shortName + ': ' + process.name
              ),
              arrayHelpers
            )}
          </div>
        </div>
      )}
    />
  )
}

export default SelectProcess
