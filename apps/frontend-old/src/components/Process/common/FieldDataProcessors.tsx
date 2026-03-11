import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import { IProcessFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

type TDatabehandlerOption = {
  id: string
  label: string
}

type TFieldDataProcessorsProps = {
  formikBag: FormikProps<IProcessFormValues>
  dataProcessors?: Map<string, string>
  options: TDatabehandlerOption[]
}

const FieldDataProcessors = (props: TFieldDataProcessorsProps) => {
  const { formikBag, options } = props
  const [dataProcessors] = useState(
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
                label="Velg databehandler"
                hideLabel
                onChange={(event) => {
                  if (event.target.value) {
                    dataProcessors.set(
                      event.target.value,
                      options.filter((option) => option.id === event.target.value)[0].label
                    )

                    arrayHelpers.form.setFieldValue('dataProcessing.processors', [
                      ...(formikBag.values.dataProcessing.processors || []),
                      event.target.value,
                    ])
                  }
                }}
              >
                <option value="">Velg databehandler</option>
                {options
                  .sort((a, b) =>
                    (a.label || '').toLocaleString().localeCompare((b.label || '').toLocaleString())
                  )
                  .filter(
                    (dataProcessing) =>
                      !formikBag.values.dataProcessing.processors.includes(
                        dataProcessing.id ? dataProcessing.id.toString() : ''
                      )
                  )
                  .map((databehandler) => (
                    <option key={databehandler.id} value={databehandler.id}>
                      {databehandler.label}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
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
