import { OnChangeParams, Option, Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import { IProcessFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

type TFieldDataProcessorsProps = {
  formikBag: FormikProps<IProcessFormValues>
  dataProcessors?: Map<string, string>
  options: Option[]
}

const FieldDataProcessors = (props: TFieldDataProcessorsProps) => {
  const { formikBag, options } = props
  const [dataProcessors, _setDataProcessors] = useState(
    props.dataProcessors ? props.dataProcessors : new Map<string, string>()
  )

  useEffect(() => {
    ;(async () => {
      if (formikBag.values.dataProcessing.processors?.length) {
        const response = await getProcessorsByIds(formikBag.values.dataProcessing.processors)
        response.forEach((response) => dataProcessors.set(response.id, response.name))
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
                options={options
                  .sort((a, b) =>
                    (a.label || '').toLocaleString().localeCompare((b.label || '').toLocaleString())
                  )
                  .filter(
                    (dataProcessing) =>
                      !formikBag.values.dataProcessing.processors.includes(
                        dataProcessing.id ? dataProcessing.id.toString() : ''
                      )
                  )}
                onChange={(params: OnChangeParams) => {
                  if (params.value[0].id && params.value[0].label) {
                    dataProcessors.set(
                      params.value[0].id.toString(),
                      params.value[0].label.toString()
                    )
                  }
                  arrayHelpers.form.setFieldValue('dataProcessing.processors', [
                    ...(formikBag.values.dataProcessing.processors || []),
                    ...params.value.map((value) => value.id),
                  ])
                }}
              />
            </div>
            <div>
              {formikBag.values.dataProcessing.processors &&
                renderTagList(
                  formikBag.values.dataProcessing.processors.map((processor) => {
                    let dataProcessorName = ''
                    if (processor) {
                      if (dataProcessors.has(processor)) {
                        dataProcessorName = dataProcessors.get(processor) || ''
                      }
                    }
                    return dataProcessorName
                  }),
                  arrayHelpers
                )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldDataProcessors
