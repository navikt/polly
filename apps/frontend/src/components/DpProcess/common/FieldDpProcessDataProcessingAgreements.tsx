import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { DpProcessFormValues } from '../../../constants'
import * as React from 'react'
import { Block } from 'baseui/block'
import { Input } from 'baseui/input'
import { Button, SHAPE } from 'baseui/button'
import { Plus } from 'baseui/icon'
import { renderTagList } from '../../common/TagList'

const FieldDpProcessDataProcessingAgreements = (props: { formikBag: FormikProps<DpProcessFormValues> }) => {
  const [currentKeywordValue, setCurrentKeywordValue] = React.useState('')
  const agreementRef = React.useRef<HTMLInputElement>(null)

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
            placeholder='(f.eks. lenke til Websak, Confluence e.l.)'
            value={currentKeywordValue}
            onChange={(event) => setCurrentKeywordValue(event.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onAddAgreement(arrayHelpers)
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
          {renderTagList(props.formikBag.values.dataProcessingAgreements, arrayHelpers)}
        </div>
      )}
    />
  )
}

export default FieldDpProcessDataProcessingAgreements
