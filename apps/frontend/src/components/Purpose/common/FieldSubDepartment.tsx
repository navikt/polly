import * as React from 'react'
import {Select} from 'baseui/select'
import {codelist, ListName} from '../../../service/Codelist'
import {FieldArray, FormikProps} from 'formik'
import {ProcessFormValues} from '../../../constants'
import {Block} from 'baseui/block'
import {renderTagList} from "../../common/TagList"

const FieldSubDepartments = (props: { formikBag: FormikProps<ProcessFormValues> }) => {

  return (
    <FieldArray
      name='subDepartments'
      render={arrayHelpers => (
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              options={codelist.getParsedOptions(ListName.SUB_DEPARTMENT).filter(o => !props.formikBag.values.subDepartments.includes(o.id))}
              onChange={({value}) => {
                arrayHelpers.form.setFieldValue('subDepartments', [...props.formikBag.values.subDepartments, ...value.map(v => v.id)])
              }}
            />
          </Block>
          <Block>
            <Block>{renderTagList(props.formikBag.values.subDepartments, arrayHelpers)}</Block>
          </Block>
        </Block>
      )}
    />
  )

}

export default FieldSubDepartments
