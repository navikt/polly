import { Field, FieldProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { getResourceById, useTeamResourceSearchOptions } from '../../../api/GetAllApi'
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

  useEffect(() => {
    ;(async () => {
      if (formikBag.values.contractOwner) {
        setDisplayName(await getResourceById(formikBag.values.contractOwner))
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
            placeholder=""
            components={{ DropdownIndicator }}
            noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
            controlShouldRenderValue={true}
            loadingMessage={() => 'Søker...'}
            isClearable={false}
            loadOptions={useTeamResourceSearchOptions}
            onChange={(event: any) => {
              if (event) {
                form.setFieldValue('contractOwner', event.id).finally()
              }
            }}
            styles={selectOverrides}
            value={{ id: displayName?.navIdent, label: displayName?.fullName }}
          />
        )}
      </Field>
    </div>
  )
}
export default FieldContractOwner
