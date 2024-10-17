import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { getProcessesByPurpose, searchProcess } from '../../api/GetAllApi'
import { IDisclosureFormValues, IProcess, IProcessShort } from '../../constants'
import { EListName, ICode, codelist } from '../../service/Codelist'
import { CustomSearchSelect } from './AsyncSelectComponents'
import { renderTagList } from './TagList'

type TSelectProcessProps = {
  formikBag: FormikProps<IDisclosureFormValues>
}

const SelectProcess = (props: TSelectProcessProps) => {
  const { formikBag } = props

  const useSearchProcessOptions = async (searchParam: string): Promise<IProcess[]> => {
    if (searchParam && searchParam.length > 2) {
      const behandlinger: IProcess[] = (await searchProcess(searchParam)).content

      const purposes: ICode[] = codelist
        .getCodes(EListName.PURPOSE)
        .filter(
          (code: ICode) => code.shortName.toLowerCase().indexOf(searchParam.toLowerCase()) >= 0
        )

      const processesPromise: Promise<any>[] = []

      for (let i = 0; i < purposes.length; i++) {
        processesPromise.push(getProcessesByPurpose(purposes[i].code))
      }

      let searchResult: IProcess[] = [
        ...behandlinger,
        ...(await Promise.all(processesPromise))
          .map((value) => value.content)
          .flatMap((value) => value),
      ]

      searchResult = searchResult
        .filter(
          (p1: IProcess, index: number, self) => index === self.findIndex((p2) => p2.id === p1.id)
        )
        .filter(
          (p1: IProcess) =>
            !formikBag.values.processes.map((value: IProcessShort) => value.id).includes(p1.id)
        )

      const OptionList = searchResult.map((behandling) => {
        return {
          ...behandling,
          value: behandling.id,
          label:
            'B' +
            behandling.number +
            ' ' +
            (behandling.purposes !== undefined ? behandling.purposes[0].shortName : '') +
            ': ' +
            behandling.name,
        }
      })

      return OptionList
    }

    return []
  }

  return (
    <FieldArray
      name="processes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="w-full">
            <CustomSearchSelect
              ariaLabel="Søk etter behandlinger"
              placeholder=""
              loadOptions={useSearchProcessOptions}
              onChange={(value: any) => {
                if (value) {
                  arrayHelpers.form.setFieldValue('processes', [
                    ...formikBag.values.processes,
                    value,
                  ])
                }
              }}
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
