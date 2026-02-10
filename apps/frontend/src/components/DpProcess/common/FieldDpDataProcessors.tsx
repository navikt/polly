import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getProcessorsByIds } from '../../../api/ProcessorApi'
import { IDpProcessFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

type TProcessorOption = {
  id: string
  label: string
}

type TFieldDpDataProcessorsProps = {
  formikBag: FormikProps<IDpProcessFormValues>
  subDataProcessors?: Map<string, string>
  options: TProcessorOption[]
}

const FieldDpDataProcessors = (props: TFieldDpDataProcessorsProps) => {
  const { formikBag, options } = props
  const [subDataProcessors, setSubDataProcessors] = useState(
    props.subDataProcessors ? props.subDataProcessors : new Map<string, string>()
  )

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
                label="test"
                hideLabel
                onChange={(event) => {
                  if (event.target.value) {
                    subDataProcessors.set(event.target.id.toString(), event.target.value.toString())
                  }
                  arrayHelpers.form.setFieldValue('subDataProcessing.processors', [
                    ...(formikBag.values.subDataProcessing.processors || []),
                    event.target.value,
                  ])
                }}
              >
                <option value="">Velg system</option>
                {options
                  .filter(
                    (option) => !formikBag.values.affiliation.products.includes(option.id as string)
                  )
                  .map((code) => (
                    <option key={code.id} value={code.id}>
                      {code.label}
                    </option>
                  ))}
              </Select>
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
                  arrayHelpers
                )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldDpDataProcessors
