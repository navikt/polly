'use client'

import { FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import {
  getDatabehandlereByIds,
  getDatabehandlereByPageAndPageSize,
} from '../../../api/DatabehandlerApi'
import { getAll } from '../../../api/GetAllApi'
import { IDatabehandler, IDpProcessFormValues } from '../../../constants'
import BoolField from '../../Process/common/BoolField'
import { Error, ModalLabel } from '../../common/ModalSchema'
import FieldDpDataProcessors from './FieldDpDataProcessors'

// TODO: databehandler (FieldDpProcessSubDataProcessor, processorList, subDataProcessors)
type TFieldDpProcessSubDataProcessorProps = {
  formikBag: FormikProps<IDpProcessFormValues>
  initialValues: IDpProcessFormValues
}

const FieldDpProcessSubDataProcessor = (props: TFieldDpProcessSubDataProcessorProps) => {
  const { formikBag, initialValues } = props
  const [processorList, setProcessorList] = useState<IDatabehandler[]>([])
  const [subDataProcessors, setSubDataProcessors] = useState(new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (initialValues.subDataProcessing.processors.length > 0) {
        const response = await getDatabehandlereByIds(initialValues.subDataProcessing.processors)
        const newProcs = new Map<string, string>()
        response.forEach((processor) => newProcs.set(processor.id, processor.navn))
        setSubDataProcessors(newProcs)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const response: IDatabehandler[] = await getAll(getDatabehandlereByPageAndPageSize)()
      if (response) {
        setProcessorList(response)
      }
    })()
  }, [])

  return (
    <>
      <div className='w-full'>
        <ModalLabel
          label='Benyttes underdatabehandler(e)?'
          tooltip='En underdatabehandler er en virksomhet som behandler personopplysninger på vegne av NAV når NAV selv opptrer som databehandler.'
          fullwidth
        />
        <div className='mt-2'>
          <BoolField
            fieldName='subDataProcessing.dataProcessor'
            value={formikBag.values.subDataProcessing.dataProcessor}
            direction='horizontal'
          />
        </div>
      </div>

      {formikBag.values.subDataProcessing.dataProcessor && (
        <>
          <div className='w-full mt-4'>
            <ModalLabel label='Databehandler' fullwidth />
            <div className='mt-2'>
              <FieldDpDataProcessors
                formikBag={formikBag}
                subDataProcessors={subDataProcessors}
                options={processorList.map((processor: IDatabehandler) => {
                  return {
                    id: processor.id,
                    label: processor.navn,
                  }
                })}
              />
            </div>
          </div>
          <Error fieldName='subDataProcessing.procesors' />
        </>
      )}
    </>
  )
}

export default FieldDpProcessSubDataProcessor
