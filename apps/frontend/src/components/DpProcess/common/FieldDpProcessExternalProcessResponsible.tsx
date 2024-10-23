import { Select, Value } from 'baseui/select'
import { Field, FieldProps } from 'formik'
import { useState } from 'react'
import { IDpProcessFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

interface IFieldDpProcessExternalProcessResponsible {
  thirdParty?: string
}

const FieldDpProcessExternalProcessResponsible = (
  props: IFieldDpProcessExternalProcessResponsible
) => {
  const { thirdParty } = props
  const [codelistUtils] = CodelistService()

  const [value, setValue] = useState<Value>(
    thirdParty
      ? [
          {
            id: thirdParty,
            label: codelistUtils.getShortname(EListName.THIRD_PARTY, thirdParty),
          },
        ]
      : []
  )

  return (
    <Field
      name="externalProcessResponsible"
      render={({ form }: FieldProps<IDpProcessFormValues>) => (
        <div className="w-full">
          <Select
            options={codelistUtils.getParsedOptions(EListName.THIRD_PARTY)}
            onChange={({ value }) => {
              setValue(value)
              form.setFieldValue('externalProcessResponsible', value.length > 0 ? value[0].id : '')
            }}
            value={value}
            placeholder=""
          />
        </div>
      )}
    />
  )
}

export default FieldDpProcessExternalProcessResponsible
