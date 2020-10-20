import * as React from "react";
import {Select} from "baseui/select";
import {codelist, ListName} from "../../../service/Codelist";
import {FieldArray, FormikProps} from "formik";
import {ProcessFormValues} from "../../../constants";
import {Block} from "baseui/block";
import {renderTagList} from '../../common/TagList'

const FieldPurpose = (props: {formikBag: FormikProps<ProcessFormValues>}) => {
  const {formikBag} = props

  return (
    <FieldArray
      name='purposes'
      render={arrayHelpers => (
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              options={codelist.getParsedOptions(ListName.PURPOSE).filter(o => !formikBag.values.purposes.includes(o.id))}
              onChange={({value}) => {
                arrayHelpers.form.setFieldValue('purposes', [...formikBag.values.purposes, ...value.map(v => v.id)])
              }}
            />
          </Block>
          <Block>
            <Block>{renderTagList(formikBag.values.purposes.map(p => codelist.getShortname(ListName.PURPOSE, p)), arrayHelpers)}</Block>
          </Block>
        </Block>
      )}
    />
  )

}

export default FieldPurpose
