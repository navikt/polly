import { FormikProps } from 'formik'
import React from 'react'
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
  const { formikBag } = props
  const [processorList, setProcessorList] = React.useState<Processor[]>([])
  const [subDataProcessors, setSubDataProcessors] = React.useState(new Map<string, string>())

  React.useEffect(() => {
    ;(async () => {
      if (props.initialValues.subDataProcessing.processors.length > 0) {
        const res = await getProcessorsByIds(props.initialValues.subDataProcessing.processors)
        const newProcs = new Map<string, string>()
        res.forEach((d) => newProcs.set(d.id, d.name))
        setSubDataProcessors(newProcs)
      }
    })()
  }, [])

  React.useEffect(() => {
    ;(async () => {
      const res = await getAll(getProcessorsByPageAndPageSize)()
      if (res) {
        setProcessorList(res)
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
              options={processorList.map((p) => {
                return {
                  id: p.id,
                  label: p.name,
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
