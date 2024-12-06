import { PlusIcon } from '@navikt/aksel-icons'
import { Button, TextField } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

interface IFieldDpProcessDataProcessingAgreementsProps {
  formikBag: FormikProps<IDpProcessFormValues>
}

const FieldDpProcessDataProcessingAgreements = (
  props: IFieldDpProcessDataProcessingAgreementsProps
) => {
  const { formikBag } = props
  const [currentKeywordValue, setCurrentKeywordValue] = useState('')
  const agreementRef = useRef<HTMLInputElement>({} as HTMLInputElement)

  const onAddAgreement = (arrayHelpers: FieldArrayRenderProps) => {
    if (!currentKeywordValue) return
    arrayHelpers.push(currentKeywordValue)
    setCurrentKeywordValue('')
    if (agreementRef && agreementRef.current) {
      agreementRef.current.focus()
    }
  }

  return (
    <FieldArray name="dataProcessingAgreements">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <div className="flex w-full">
            <TextField
              className="w-full"
              label=""
              hideLabel
              placeholder="(f.eks. lenke til Websak, Confluence e.l.)"
              value={currentKeywordValue}
              onChange={(event) => setCurrentKeywordValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onAddAgreement(arrayHelpers)
              }}
              onBlur={() => onAddAgreement(arrayHelpers)}
              ref={agreementRef}
            />
            <Button type="button" onClick={() => onAddAgreement(arrayHelpers)}>
              <PlusIcon aria-hidden />
            </Button>
          </div>
          {renderTagList(formikBag.values.dataProcessingAgreements, arrayHelpers)}
        </div>
      )}
    </FieldArray>
  )
}

export default FieldDpProcessDataProcessingAgreements
