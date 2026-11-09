'use client'

import { Field, FieldProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getResourceById, useTeamResourceSearchOptions } from '../../../api/TeamApi'
import { IProcessorFormValues, ITeamResource } from '../../../constants'
import CustomSearchSelect from '../../common/AsyncSelectComponents'
import { LabelWithDescription } from '../../common/LabelWithTooltip'
import { RenderTagList } from '../../common/RenderTagList'

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
    <div className='w-full mt-4'>
      <LabelWithDescription
        label='Avtaleeier'
        description='Den som formelt står som eier av avtalen'
      />
      <Field name='contractOwner'>
        {({ form }: FieldProps<string, IProcessorFormValues>) => (
          <>
            <CustomSearchSelect
              ariaLabel='Avtaleeier'
              placeholder=''
              inputId='contractOwner'
              instanceId='contractOwner'
              onChange={(option: any) => {
                if (option?.value) {
                  form.setFieldValue('contractOwner', option.value).finally()
                  setSelected(option)
                }
              }}
              loadOptions={useTeamResourceSearchOptions}
            />
            {form.values.contractOwner && (
              <RenderTagList
                list={[selected?.label || displayName?.fullName || form.values.contractOwner]}
                onRemove={() => {
                  form.setFieldValue('contractOwner', '').finally()
                  setDisplayName(undefined)
                  setSelected(null)
                }}
              />
            )}
          </>
        )}
      </Field>
    </div>
  )
}
export default FieldContractOwner
