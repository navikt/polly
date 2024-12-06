import { Button, SHAPE } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { Input } from 'baseui/input'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { KeyboardEvent, useRef, useState } from 'react'
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
  const agreementRef = useRef<HTMLInputElement | HTMLTextAreaElement>(
    {} as HTMLInputElement | HTMLTextAreaElement
  )

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
          <Input
            type="text"
            size="compact"
            placeholder="(f.eks. lenke til Websak, Confluence e.l.)"
            value={currentKeywordValue}
            onChange={(event) => setCurrentKeywordValue(event.currentTarget.value)}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              if (event.key === 'Enter') onAddAgreement(arrayHelpers)
            }}
            onBlur={() => onAddAgreement(arrayHelpers)}
            inputRef={agreementRef}
            overrides={{
              After: () => (
                <Button type="button" size="compact" shape={SHAPE.square}>
                  <Plus />
                </Button>
              ),
            }}
          />
          {renderTagList(formikBag.values.dataProcessingAgreements, arrayHelpers)}
        </div>
      )}
    />
  )
}

export default FieldDpProcessDataProcessingAgreements
