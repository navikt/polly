import { FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getAll } from '../../../api/GetAllApi'
import { getProcessorsByIds, getProcessorsByPageAndPageSize } from '../../../api/ProcessorApi'
import { IDpProcessFormValues, IProcessor } from '../../../constants'
import BoolField from '../../Process/common/BoolField'
import { Error, ModalLabel } from '../../common/ModalSchema'
import FieldDpDataProcessors from './FieldDpDataProcessors'

type TFieldDpProcessSubDataProcessorProps = {
  formikBag: FormikProps<IDpProcessFormValues>
  initialValues: IDpProcessFormValues
}

const FieldDpProcessSubDataProcessor = (props: TFieldDpProcessSubDataProcessorProps) => {
  const { formikBag, initialValues } = props
  const [processorList, setProcessorList] = useState<IProcessor[]>([])
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
      const response: IProcessor[] = await getAll(getProcessorsByPageAndPageSize)()
      if (response) {
        setProcessorList(response)
      }
    })()
  }, [])

  return (
    <>
      <div className="w-full">
        <ModalLabel
          label="Benyttes underdatabehandler(e)?"
          tooltip="En underdatabehandler er en virksomhet som behandler personopplysninger på vegne av NAV når NAV selv opptrer som databehandler."
          fullwidth
        />
        <div className="mt-2">
          <BoolField
            fieldName="subDataProcessing.dataProcessor"
            value={formikBag.values.subDataProcessing.dataProcessor}
            direction="horizontal"
          />
        </div>
      </div>

      {formikBag.values.subDataProcessing.dataProcessor && (
        <>
          <div className="w-full mt-4">
            <ModalLabel label="Databehandler" fullwidth />
            <div className="mt-2">
              <FieldDpDataProcessors
                formikBag={formikBag}
                subDataProcessors={subDataProcessors}
                options={processorList.map((processor: IProcessor) => {
                  return {
                    id: processor.id,
                    label: processor.name,
                  }
                })}
              />
            </div>
          </div>
          <Error fieldName="subDataProcessing.procesors" />
        </>
      )}
    </>
  )
}

export default FieldDpProcessSubDataProcessor
