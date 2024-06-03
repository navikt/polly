import * as React from 'react'
import { useEffect, useState } from 'react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { Block } from 'baseui/block'
import { DpProcessFormValues } from '../../../constants'
import { Option, Select } from 'baseui/select'
import { renderTagList } from '../../common/TagList'
import { getProcessorsByIds } from '../../../api/ProcessorApi'

type fieldDpDataProcessorsProps = {
  formikBag: FormikProps<DpProcessFormValues>
  subDataProcessors?: Map<string, string>
  options: Option[]
}

const FieldDpDataProcessors = (props: fieldDpDataProcessorsProps) => {
  const [subDataProcessors, setSubDataProcessors] = useState(props.subDataProcessors ? props.subDataProcessors : new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (props.formikBag.values.subDataProcessing.processors?.length) {
        const res = await getProcessorsByIds(props.formikBag.values.subDataProcessing.processors)
        const resDataProcessors = new Map<string, string>()
        res.forEach((r) => resDataProcessors.set(r.id, r.name))
        setSubDataProcessors(resDataProcessors)
      }
    })()
  }, [])

  return (
    <FieldArray
      name="subDataProcessing.processors"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <Block width="100%">
            <Block width="100%">
              <Select
                clearable
                noResultsMsg='Databehandler er ikke registrert i løsningen. Registrer databehandleren først.'
                options={props.options
                  .sort((a, b) => (a.label || '').toLocaleString().localeCompare((b.label || '').toLocaleString()))
                  .filter((dp) => !props.formikBag.values.subDataProcessing.processors.includes(dp.id ? dp.id.toString() : ''))}
                onChange={(params) => {
                  if (params.value[0].id && params.value[0].label) {
                    subDataProcessors.set(params.value[0].id.toString(), params.value[0].label.toString())
                  }
                  arrayHelpers.form.setFieldValue('subDataProcessing.processors', [
                    ...(props.formikBag.values.subDataProcessing.processors || []),
                    ...params.value.map((v) => v.id),
                  ])
                }}
              />
            </Block>
            <Block>
              {props.formikBag.values.subDataProcessing.processors &&
                renderTagList(
                  props.formikBag.values.subDataProcessing.processors.map((dp) => {
                    let subDataProcessorName = ''
                    if (dp) {
                      if (subDataProcessors.has(dp)) {
                        subDataProcessorName = subDataProcessors.get(dp) || ''
                      }
                    }
                    return subDataProcessorName
                  }),
                  arrayHelpers,
                )}
            </Block>
          </Block>
        </>
      )}
    />
  )
}

export default FieldDpDataProcessors
