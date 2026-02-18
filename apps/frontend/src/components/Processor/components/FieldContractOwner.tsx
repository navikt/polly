import { Field, FieldProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { getResourceById, useTeamResourceSearchOptions } from '../../../api/TeamApi'
import { IProcessorFormValues, ITeamResource } from '../../../constants'
import {
  DropdownIndicator,
  noOptionMessage,
  selectOverrides,
} from '../../common/AsyncSelectComponents'
import { LabelWithDescription } from '../../common/LabelWithTooltip'

type TFieldContractOwnerProps = {
  formikBag: FormikProps<IProcessorFormValues>
}

const FieldContractOwner = (props: TFieldContractOwnerProps) => {
  const { formikBag } = props
  const [displayName, setDisplayName] = useState<ITeamResource>()
  const [selected, setSelected] = useState<{ value: string; label: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      if (formikBag.values.contractOwner) {
        try {
          const resource = await getResourceById(formikBag.values.contractOwner)
          setDisplayName(resource)
          setSelected({ value: resource.navIdent, label: resource.fullName })
        } catch {
          setDisplayName(undefined)
          setSelected({
            value: formikBag.values.contractOwner,
            label: formikBag.values.contractOwner,
          })
        }
      } else {
        setDisplayName(undefined)
        setSelected(null)
      }
    })()
  }, [formikBag.values.contractOwner])

  return (
    <div className="w-full mt-4">
      <LabelWithDescription
        label="Avtaleeier"
        description="Den som formelt står som eier av avtalen"
      />
      <Field name="contractOwner">
        {({ form }: FieldProps<string, IProcessorFormValues>) => (
          <AsyncSelect
            className="w-full"
            aria-label="Avtaleeier"
            inputId="contractOwner"
            instanceId="contractOwner"
            placeholder=""
            components={{ DropdownIndicator }}
            noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
            controlShouldRenderValue={true}
            loadingMessage={() => 'Søker...'}
            isClearable={!!form.values.contractOwner}
            loadOptions={useTeamResourceSearchOptions}
            onChange={(option: any) => {
              if (option) {
                form.setFieldValue('contractOwner', option.value).finally()
                setSelected(option)
                return
              }

              form.setFieldValue('contractOwner', '').finally()
              setDisplayName(undefined)
              setSelected(null)
            }}
            styles={selectOverrides}
            value={
              selected ||
              (displayName ? { value: displayName.navIdent, label: displayName.fullName } : null)
            }
          />
        )}
      </Field>
    </div>
  )
}
export default FieldContractOwner
