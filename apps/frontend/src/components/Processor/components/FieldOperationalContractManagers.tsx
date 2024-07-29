import { Select } from 'baseui/select'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { useEffect, useState } from 'react'
import { getResourcesByIds, useTeamResourceSearch } from '../../../api'
import { ProcessorFormValues } from '../../../constants'
import { renderTagList } from '../../common/TagList'

type fieldOperationalContractManagersProps = {
  formikBag: FormikProps<ProcessorFormValues>
  resources?: Map<string, string>
}

const FieldOperationalContractManagers = (props: fieldOperationalContractManagersProps) => {
  const { formikBag } = props
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()
  const [resources, setResources] = useState(props.resources ? props.resources : new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (formikBag.values.operationalContractManagers && formikBag.values.operationalContractManagers?.length > 0) {
        const result = await getResourcesByIds(formikBag.values.operationalContractManagers)
        result.forEach((resource) => resources.set(resource.navIdent, resource.fullName))
      }
    })()
  }, [])

  return (
    <FieldArray name="operationalContractManagers">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                clearable
                options={teamResourceSearchResult.filter(
                  (result) =>
                    !formikBag.values.operationalContractManagers
                      ?.map((operationalContractManagers) => operationalContractManagers)
                      .includes(result.id ? result.id.toString() : ''),
                )}
                onChange={(params) => {
                  if (params.value[0].id && params.value[0].label) {
                    resources.set(params.value[0].id.toString(), params.value[0].label.toString())
                  }
                  arrayHelpers.form.setFieldValue('operationalContractManagers', [
                    ...(formikBag.values.operationalContractManagers || []),
                    ...params.value.map((value) => value.id),
                  ])
                }}
                onInputChange={(event) => setTeamResourceSearch(event.currentTarget.value)}
                isLoading={teamResourceSearchLoading}
              />
            </div>
            <div>
              {formikBag.values.operationalContractManagers &&
                renderTagList(
                  formikBag.values.operationalContractManagers.map((operationalContractManagers) => {
                    let fullName = ''
                    if (operationalContractManagers) {
                      if (resources.has(operationalContractManagers)) {
                        fullName = resources.get(operationalContractManagers) || ''
                      }
                    }
                    return fullName
                  }),
                  arrayHelpers,
                )}
            </div>
          </div>
        </>
      )}
    </FieldArray>
  )
}

export default FieldOperationalContractManagers
