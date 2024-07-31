import { FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getAll } from '../../../api'
import { getProcessorsByIds, getProcessorsByPageAndPageSize } from '../../../api/ProcessorApi'
import { DpProcessFormValues, Processor } from '../../../constants'
import BoolField from '../../Process/common/BoolField'
import { Error, ModalLabel } from '../../common/ModalSchema'
import FieldDpDataProcessors from './FieldDpDataProcessors'

type FieldDpProcessSubDataProcessorProps = {
  formikBag: FormikProps<DpProcessFormValues>
  initialValues: DpProcessFormValues
}

const FieldDpProcessSubDataProcessor = (props: FieldDpProcessSubDataProcessorProps) => {
  const { formikBag, initialValues } = props
  const [processorList, setProcessorList] = useState<Processor[]>([])
  const [subDataProcessors, setSubDataProcessors] = useState(new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (initialValues.subDataProcessing.processors.length > 0) {
        const response = await getProcessorsByIds(initialValues.subDataProcessing.processors)
        const newProcs = new Map<string, string>()
        response.forEach((processor) => newProcs.set(processor.id, processor.name))
        setSubDataProcessors(newProcs)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const response: Processor[] = await getAll(getProcessorsByPageAndPageSize)()
      if (response) {
        setProcessorList(response)
      }
    })()
  }, [])

  return (
    <>
      <div className="flex w-full">
        <ModalLabel
          label="Benyttes underdatabehandler(e)?"
          tooltip="En underdatabehandler er en virksomhet som behandler personopplysninger på vegne av NAV når NAV selv opptrer som databehandler."
        />
        <BoolField fieldName="subDataProcessing.dataProcessor" value={formikBag.values.subDataProcessing.dataProcessor} />
      </div>

      {formikBag.values.subDataProcessing.dataProcessor && (
        <>
          <div className="flex w-full mt-4">
            <ModalLabel label="Databehandler" />
            <FieldDpDataProcessors
              formikBag={formikBag}
              subDataProcessors={subDataProcessors}
              options={processorList.map((processor: Processor) => {
                return {
                  id: processor.id,
                  label: processor.name,
                }
              })}
            />
          </div>
          <Error fieldName="subDataProcessing.procesors" />
        </>
      )}
    </>
  )
}

export default FieldDpProcessSubDataProcessor
