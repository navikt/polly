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
    <FieldArray
      name="dataProcessingAgreements"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <div className="w-full">
          <TextField
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
          {renderTagList(formikBag.values.dataProcessingAgreements, arrayHelpers)}
        </div>
      )}
    />
  )
}

export default FieldDpProcessDataProcessingAgreements
