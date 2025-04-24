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
  const [operationalContractManagers, setOperationalContractManagers] = useState<string[]>()
  const resources = new Map<string, string>()

  useEffect(() => {
    ;(async () => {
      if (
        formikBag.values.operationalContractManagers &&
        formikBag.values.operationalContractManagers?.length > 0
      ) {
        const result = await getResourcesByIds(formikBag.values.operationalContractManagers)
        result.forEach((resource) => resources.set(resource.navIdent, resource.fullName))
        setOperationalContractManagers(resources.values().toArray())
      }
    })()
  }, [formikBag.values.operationalContractManagers])

  return (
    <FieldArray name="operationalContractManagers">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <div className="mt-4">
          <LabelWithDescription label="Angi de(n) fagansvarlige som kan svare ut detaljer knyttet til avtalen og operasjonalisering av denne." />
          <CustomSearchSelect
            ariaLabel="Fagansvarlig"
            placeholder=""
            onChange={(event: any) => {
              if (event) {
                arrayHelpers.form.setFieldValue('operationalContractManagers', [
                  ...formikBag.values.operationalContractManagers,
                  event.id,
                ])
              }
            }}
            loadOptions={useTeamResourceSearchOptions}
          />

          <RenderTagList
            list={operationalContractManagers as string[]}
            onRemove={arrayHelpers.remove}
          />
        </div>
      )}
    </FieldArray>
  )
}

export default FieldOperationalContractManagers
