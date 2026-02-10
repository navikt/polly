import { UNSAFE_Combobox } from '@navikt/ds-react'
import { Field, FieldProps } from 'formik'
import { useMemo, useState } from 'react'
import { IProcessFormValues } from '../../../constants'
import { CodelistService, EListName } from '../../../service/Codelist'

interface IFieldCommonExternalProcessResponsibleProps {
  thirdParty?: string
  hideSelect: () => void
}

const FieldCommonExternalProcessResponsible = (
  props: IFieldCommonExternalProcessResponsibleProps
) => {
  const { thirdParty, hideSelect } = props
  const [codelistUtils] = CodelistService()

  const [selected, setSelected] = useState<{ label: string; value: string }[]>(
    thirdParty
      ? [
          {
            value: thirdParty,
            label: codelistUtils.getShortname(EListName.THIRD_PARTY, thirdParty),
          },
        ]
      : []
  )

  const comboboxOptions = useMemo(
    () =>
      codelistUtils.getParsedOptions(EListName.THIRD_PARTY).map((o: any) => ({
        label: o.label,
        value: o.id,
      })),
    [codelistUtils]
  )

  return (
    <Field
      name="commonExternalProcessResponsible"
      render={({ form }: FieldProps<IProcessFormValues>) => (
        <div className="w-full">
          <UNSAFE_Combobox
            label="Felles behandlingsansvarlig"
            hideLabel
            options={comboboxOptions}
            filteredOptions={comboboxOptions}
            selectedOptions={selected}
            onToggleSelected={(optionValue, isSelected) => {
              if (!isSelected) {
                hideSelect()
                setSelected([])
                form.setFieldValue('commonExternalProcessResponsible', '')
                return
              }

              const option = comboboxOptions.find((o) => o.value === optionValue)
              if (option) {
                setSelected([option])
                form.setFieldValue('commonExternalProcessResponsible', option.value)
              }
            }}
          />
        </div>
      )}
    />
  )
}

export default FieldCommonExternalProcessResponsible
