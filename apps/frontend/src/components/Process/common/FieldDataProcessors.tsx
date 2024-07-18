import { Option, Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import { ProcessFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

type fieldDataProcessorsProps = {
  formikBag: FormikProps<ProcessFormValues>
  dataProcessors?: Map<string, string>
  options: Option[]
}

const FieldDataProcessors = (props: fieldDataProcessorsProps) => {
  const [dataProcessors, setDataProcessors] = useState(props.dataProcessors ? props.dataProcessors : new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (props.formikBag.values.dataProcessing.processors?.length) {
        const res = await getProcessorsByIds(props.formikBag.values.dataProcessing.processors)
        res.forEach((r) => dataProcessors.set(r.id, r.name))
      }
    })()
  }, [])

  return (
    <FieldArray
      name="dataProcessing.processors"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                noResultsMsg="Databehandler er ikke registrert i løsningen. Registrer databehandleren først."
                options={props.options
                  .sort((a, b) => (a.label || '').toLocaleString().localeCompare((b.label || '').toLocaleString()))
                  .filter((dp) => !props.formikBag.values.dataProcessing.processors.includes(dp.id ? dp.id.toString() : ''))}
                onChange={(params) => {
                  if (params.value[0].id && params.value[0].label) {
                    dataProcessors.set(params.value[0].id.toString(), params.value[0].label.toString())
                  }
                  arrayHelpers.form.setFieldValue('dataProcessing.processors', [...(props.formikBag.values.dataProcessing.processors || []), ...params.value.map((v) => v.id)])
                }}
              />
            </div>
            <div>
              {props.formikBag.values.dataProcessing.processors &&
                renderTagList(
                  props.formikBag.values.dataProcessing.processors.map((dp) => {
                    let dataProcessorName = ''
                    if (dp) {
                      if (dataProcessors.has(dp)) {
                        dataProcessorName = dataProcessors.get(dp) || ''
                      }
                    }
                    return dataProcessorName
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

export default FieldDataProcessors
