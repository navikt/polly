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
  const [resourceNamesById, setResourceNamesById] = useState<Record<string, string>>({})

  const currentIds = formikBag.values.operationalContractManagers || []

  const displayList = currentIds.map((id) => resourceNamesById[id] || id)

  useEffect(() => {
    ;(async () => {
      if (currentIds.length === 0) {
        return
      }

      try {
        const result = await getResourcesByIds(currentIds)
        setResourceNamesById((prev) => {
          const next = { ...prev }
          result.forEach((resource) => {
            if (resource?.navIdent && resource?.fullName) {
              next[resource.navIdent] = resource.fullName
            }
          })
          return next
        })
      } catch {
        // Ignore; we'll show ids until names can be resolved
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
                setResourceNamesById((prev) => ({ ...prev, [nextId]: event.label }))
              }

              arrayHelpers.push(nextId)
            }}
            loadOptions={useTeamResourceSearchOptions}
          />

          <RenderTagList list={displayList} onRemove={arrayHelpers.remove} />
        </div>
      )}
    </FieldArray>
  )
}

export default FieldOperationalContractManagers
