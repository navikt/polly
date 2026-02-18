import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getResourcesByIds, useTeamResourceSearchOptions } from '../../../api/TeamApi'
import { IProcessorFormValues } from '../../../constants'
import CustomSearchSelect from '../../common/AsyncSelectComponents'
import { LabelWithDescription } from '../../common/LabelWithTooltip'
import { RenderTagList } from '../../common/RenderTagList'

type TFieldOperationalContractManagersProps = {
  formikBag: FormikProps<IProcessorFormValues>
}

const FieldOperationalContractManagers = (props: TFieldOperationalContractManagersProps) => {
  const { formikBag } = props
  const [operationalContractManagers, setOperationalContractManagers] = useState<string[]>([])

  const currentIds = formikBag.values.operationalContractManagers || []

  useEffect(() => {
    ;(async () => {
      if (currentIds.length === 0) {
        setOperationalContractManagers([])
        return
      }

      try {
        const result = await getResourcesByIds(currentIds)
        const names = result
          .map((resource) => resource?.fullName)
          .filter((name): name is string => Boolean(name))

        setOperationalContractManagers(names.length > 0 ? names : currentIds)
      } catch {
        setOperationalContractManagers(currentIds)
      }
    })()
  }, [currentIds.join('|')])

  return (
    <FieldArray name="operationalContractManagers">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className="mt-4">
          <LabelWithDescription label="Angi de(n) fagansvarlige som kan svare ut detaljer knyttet til avtalen og operasjonalisering av denne." />
          <CustomSearchSelect
            ariaLabel="Fagansvarlig"
            placeholder=""
            inputId="operationalContractManagers"
            instanceId="operationalContractManagers"
            onChange={(event: any) => {
              if (!event) {
                return
              }

              const nextId = event.value
              if (!nextId) {
                return
              }

              if (currentIds.includes(nextId)) {
                return
              }

              if (event.label) {
                setOperationalContractManagers([...operationalContractManagers, event.label])
              }

              arrayHelpers.form.setFieldValue('operationalContractManagers', [
                ...currentIds,
                nextId,
              ])
            }}
            loadOptions={useTeamResourceSearchOptions}
          />

          <RenderTagList list={operationalContractManagers} onRemove={arrayHelpers.remove} />
        </div>
      )}
    </FieldArray>
  )
}

export default FieldOperationalContractManagers
