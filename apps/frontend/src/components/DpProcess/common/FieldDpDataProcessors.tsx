import { OnChangeParams, Option, Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import { DpProcessFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

type fieldDpDataProcessorsProps = {
  formikBag: FormikProps<DpProcessFormValues>
  subDataProcessors?: Map<string, string>
  options: Option[]
}

const FieldDpDataProcessors = (props: fieldDpDataProcessorsProps) => {
  const { formikBag, options } = props
  const [subDataProcessors, setSubDataProcessors] = useState(props.subDataProcessors ? props.subDataProcessors : new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (formikBag.values.subDataProcessing.processors?.length) {
        const response = await getProcessorsByIds(formikBag.values.subDataProcessing.processors)
        const resDataProcessors = new Map<string, string>()
        response.forEach((process) => resDataProcessors.set(process.id, process.name))
        setSubDataProcessors(resDataProcessors)
      }
    })()
  }, [])

  return (
    <FieldArray
      name="subDataProcessing.processors"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                noResultsMsg="Databehandler er ikke registrert i løsningen. Registrer databehandleren først."
                options={options
                  .sort((a, b) => (a.label || '').toLocaleString().localeCompare((b.label || '').toLocaleString()))
                  .filter((dataProcessing) => !formikBag.values.subDataProcessing.processors.includes(dataProcessing.id ? dataProcessing.id.toString() : ''))}
                onChange={(params: OnChangeParams) => {
                  if (params.value[0].id && params.value[0].label) {
                    subDataProcessors.set(params.value[0].id.toString(), params.value[0].label.toString())
                  }
                  arrayHelpers.form.setFieldValue('subDataProcessing.processors', [
                    ...(formikBag.values.subDataProcessing.processors || []),
                    ...params.value.map((value) => value.id),
                  ])
                }}
              />
            </div>
            <div>
              {formikBag.values.subDataProcessing.processors &&
                renderTagList(
                  formikBag.values.subDataProcessing.processors.map((dataProcessing: string) => {
                    let subDataProcessorName = ''
                    if (dataProcessing) {
                      if (subDataProcessors.has(dataProcessing)) {
                        subDataProcessorName = subDataProcessors.get(dataProcessing) || ''
                      }
                    }
                    return subDataProcessorName
                  }),
                  arrayHelpers,
                )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldDpDataProcessors
