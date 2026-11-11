'use client'

import { Field, FieldProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getResourceById, useTeamResourceSearchOptions } from '../../../api/TeamApi'
import { IDatabehandlerFormValues, ITeamResource } from '../../../constants'
import CustomSearchSelect from '../../common/AsyncSelectComponents'
import { LabelWithDescription } from '../../common/LabelWithTooltip'
import { RenderTagList } from '../../common/RenderTagList'

type TFieldAvtaleeierProps = {
  formikBag: FormikProps<IDatabehandlerFormValues>
}

const FieldAvtaleeier = (props: TFieldAvtaleeierProps) => {
  const { formikBag } = props
  const [displayName, setDisplayName] = useState<ITeamResource>()
  const [selected, setSelected] = useState<{ value: string; label: string } | null>(null)

  useEffect(() => {
    ;(async () => {
      if (formikBag.values.avtaleeier) {
        try {
          const resource = await getResourceById(formikBag.values.avtaleeier)
          setDisplayName(resource)
          setSelected({ value: resource.navIdent, label: resource.fullName })
        } catch {
          setDisplayName(undefined)
          setSelected({
            value: formikBag.values.avtaleeier,
            label: formikBag.values.avtaleeier,
          })
        }
      } else {
        setDisplayName(undefined)
        setSelected(null)
      }
    })()
  }, [formikBag.values.avtaleeier])

  return (
    <div className='w-full mt-4'>
      <LabelWithDescription
        label='Avtaleeier'
        description='Den som formelt står som eier av avtalen'
      />
      <Field name='avtaleeier'>
        {({ form }: FieldProps<string, IDatabehandlerFormValues>) => (
          <>
            <CustomSearchSelect
              ariaLabel='Avtaleeier'
              placeholder=''
              inputId='avtaleeier'
              instanceId='avtaleeier'
              onChange={(option: any) => {
                if (option?.value) {
                  form.setFieldValue('avtaleeier', option.value).finally()
                  setSelected(option)
                }
              }}
              loadOptions={useTeamResourceSearchOptions}
            />
            {form.values.avtaleeier && (
              <RenderTagList
                list={[selected?.label || displayName?.fullName || form.values.avtaleeier]}
                onRemove={() => {
                  form.setFieldValue('avtaleeier', '').finally()
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
export default FieldAvtaleeier
