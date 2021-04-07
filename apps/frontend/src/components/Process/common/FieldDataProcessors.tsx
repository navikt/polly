import * as React from 'react'
import {useEffect, useState} from 'react'
import {FieldArray, FormikProps} from 'formik'
import {Block} from 'baseui/block'
import {ProcessFormValues} from "../../../constants";
import {Select} from "baseui/select";
import {renderTagList} from "../../common/TagList";
import {getProcessorsByIds, useProcessorSearch} from "../../../api/ProcessorApi";
import {intl} from "../../../util";

type fieldDataProcessorsProps = {
  formikBag: FormikProps<ProcessFormValues>;
  dataProcessors?: Map<string, string>
}

const FieldDataProcessors = (props: fieldDataProcessorsProps) => {
  const [dataProcessorSearchResult, setDataProcessorSearch, dataProcessorLoading] = useProcessorSearch()
  const [dataProcessors, setDataProcessors] = useState(props.dataProcessors ? props.dataProcessors : new Map<string, string>())

  useEffect(() => {
    (async () => {
      if (props.formikBag.values.dataProcessing.processors?.length) {
        const res = await getProcessorsByIds(props.formikBag.values.dataProcessing.processors)
        res.forEach(r => dataProcessors.set(r.id, r.name))
      }
    })()
  }, [])

  return <FieldArray
    name='dataProcessing.dataProcessorAgreements'
    render={arrayHelpers => (
      <>
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              noResultsMsg={intl.notFoundProcessor}
              options={dataProcessorSearchResult.filter(dp => !props.formikBag.values.dataProcessing.dataProcessorAgreements.includes(dp.id ? dp.id.toString() : ''))}
              onChange={(params) => {
                if (params.value[0].id && params.value[0].label) {
                  dataProcessors.set(params.value[0].id.toString(), params.value[0].label.toString())
                }
                arrayHelpers.form.setFieldValue('dataProcessing.dataProcessorAgreements', [...props.formikBag.values.dataProcessing.dataProcessorAgreements || [], ...params.value.map(v => v.id)])
              }}
              onInputChange={event => setDataProcessorSearch(event.currentTarget.value)}
              isLoading={dataProcessorLoading}
            />
          </Block>
          <Block>{props.formikBag.values.dataProcessing.dataProcessorAgreements && renderTagList(props.formikBag.values.dataProcessing.dataProcessorAgreements.map(dp => {
            let dataProcessorName = ""
            if (dp) {
              if (dataProcessors.has(dp)) {
                dataProcessorName = dataProcessors.get(dp) || ""
              }
            }
            return dataProcessorName
          }), arrayHelpers)}</Block>
        </Block>
      </>
    )}
  />
}

export default FieldDataProcessors
