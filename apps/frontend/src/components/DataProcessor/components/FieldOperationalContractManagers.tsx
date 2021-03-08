import * as React from 'react'
import {useEffect, useState} from 'react'
import {FieldArray, FormikProps} from 'formik'
import {Block} from 'baseui/block'
import {DataProcessorFormValues} from "../../../constants";
import {Select, Value} from "baseui/select";
import {getResourcesByIds, useTeamResourceSearch} from "../../../api";
import {renderTagList} from "../../common/TagList";

type fieldOperationalContractManagersProps = {
  formikBag: FormikProps<DataProcessorFormValues>;
  resources?: Map<string, string>
}

const FieldOperationalContractManagers = (props: fieldOperationalContractManagersProps) => {
  const [value, setValue] = React.useState<Value>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()
  const [resources, setResources] = useState(props.resources ? props.resources : new Map<string, string>())
  // const resources = new Map()
  // useEffect(()=>{
  //   props.formikBag.values.operationalContractManagers?.forEach(id=>{
  //     (async ()=>{
  //       setResources([...resources,await getResourceById(id)])
  //     })()
  //   })
  //   }, [props.formikBag.values.operationalContractManagers])

  // useEffect(() => {
  //   (async () => {
  //     if (OperationalContractManagers) {
  //       const teamResource = await getResourceById(OperationalContractManagers)
  //       setValue([{id: OperationalContractManagers, label: teamResource.fullName, resource: teamResource}])
  //     } else {
  //       setValue([])
  //     }
  //   })()
  // }, [props.formikBag.values.operationalContractManagers])

  useEffect(() => {
    (async () => {
      if (props.formikBag.values.operationalContractManagers && props.formikBag.values.operationalContractManagers?.length > 0) {
        const res = await getResourcesByIds(props.formikBag.values.operationalContractManagers)
        res.forEach(r => resources.set(r.navIdent, r.fullName))
      }
    })()
  }, [])

  return <FieldArray
    name='operationalContractManagers'
    render={arrayHelpers => (
      <>
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              options={teamResourceSearchResult.filter(r => !props.formikBag.values.operationalContractManagers?.map(ocm => ocm).includes(r.id ? r.id.toString() : ''))}
              onChange={(params) => {
                console.log(params.value[0].teamResource)
                console.log(params.value)
                if (params.value[0].id && params.value[0].label) {
                  resources.set(params.value[0].id.toString(), params.value[0].label.toString())
                }
                arrayHelpers.form.setFieldValue('operationalContractManagers', [...props.formikBag.values.operationalContractManagers || [], ...params.value.map(v => v.id)])
              }}
              onInputChange={event => setTeamResourceSearch(event.currentTarget.value)}
              isLoading={teamResourceSearchLoading}
            />
          </Block>
          <Block>{props.formikBag.values.operationalContractManagers && renderTagList(props.formikBag.values.operationalContractManagers.map(ocm => {
            let fullName = ""
            if (ocm) {
              if (resources.has(ocm)) {
                fullName = resources.get(ocm) || ""
              }
            }
            return fullName
          }), arrayHelpers)}</Block>
        </Block>
      </>
    )}
  />
}

export default FieldOperationalContractManagers
