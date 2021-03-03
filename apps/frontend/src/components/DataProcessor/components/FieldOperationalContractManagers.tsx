import * as React from 'react'
import {useState} from 'react'
import {FieldArray, FormikProps} from 'formik'
import {Block} from 'baseui/block'
import {DataProcessorFormValues} from "../../../constants";
import {Select, Value} from "baseui/select";
import {useTeamResourceSearch} from "../../../api";
import {renderTagList} from "../../common/TagList";

type fieldOperationalContractManagersProps = {
  formikBag: FormikProps<DataProcessorFormValues>
}

const FieldOperationalContractManagers = (props: fieldOperationalContractManagersProps) => {
  const [value, setValue] = React.useState<Value>()
  const [teamResourceSearchResult, setTeamResourceSearch, teamResourceSearchLoading] = useTeamResourceSearch()
  const [resources, setResources] = useState([])

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

  return <FieldArray
    name='operationalContractManagers'
    render={arrayHelpers => (
      <>
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              options={teamResourceSearchResult.filter(r => !props.formikBag.values.operationalContractManagers?.map(ocm => ocm.navIdent).includes(r.id? r.id.toString() : ''))}
              onChange={(params) => {
                console.log(params)
                // setValue(value)
                arrayHelpers.form.setFieldValue('operationalContractManagers', [...props.formikBag.values.operationalContractManagers || [], ...params.value.map(v => v.teamResource)])
              }}
              onInputChange={event => setTeamResourceSearch(event.currentTarget.value)}
              isLoading={teamResourceSearchLoading}
            />
          </Block>
          <Block>{props.formikBag.values.operationalContractManagers && renderTagList(props.formikBag.values.operationalContractManagers.map(ocm => ocm.fullName), arrayHelpers)}</Block>
        </Block>
      </>
    )}
  />
}

export default FieldOperationalContractManagers
