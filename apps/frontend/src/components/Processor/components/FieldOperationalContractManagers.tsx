import * as React from 'react'
import { useEffect, useState } from 'react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { Block } from 'baseui/block'
import { ProcessorFormValues } from '../../../constants'
import { Select } from 'baseui/select'
import { getResourcesByIds, useTeamResourceSearch } from '../../../api'
import { renderTagList } from '../../common/TagList'

type fieldOperationalContractManagersProps = {
  formikBag: FormikProps<ProcessorFormValues>
  resources?: Map<string, string>
}

const FieldOperationalContractManagers = (props: fieldOperationalContractManagersProps) => {
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()
  const [resources, setResources] = useState(props.resources ? props.resources : new Map<string, string>())

  useEffect(() => {
    ;(async () => {
      if (props.formikBag.values.operationalContractManagers && props.formikBag.values.operationalContractManagers?.length > 0) {
        const res = await getResourcesByIds(props.formikBag.values.operationalContractManagers)
        res.forEach((r) => resources.set(r.navIdent, r.fullName))
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
                options={teamResourceSearchResult.filter((r) => !props.formikBag.values.operationalContractManagers?.map((ocm) => ocm).includes(r.id ? r.id.toString() : ''))}
                onChange={(params) => {
                  if (params.value[0].id && params.value[0].label) {
                    resources.set(params.value[0].id.toString(), params.value[0].label.toString())
                  }
                  arrayHelpers.form.setFieldValue('operationalContractManagers', [...(props.formikBag.values.operationalContractManagers || []), ...params.value.map((v) => v.id)])
                }}
                onInputChange={(event) => setTeamResourceSearch(event.currentTarget.value)}
                isLoading={teamResourceSearchLoading}
              />
            </div>
            <div>
              {props.formikBag.values.operationalContractManagers &&
                renderTagList(
                  props.formikBag.values.operationalContractManagers.map((ocm) => {
                    let fullName = ''
                    if (ocm) {
                      if (resources.has(ocm)) {
                        fullName = resources.get(ocm) || ''
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
