import * as React from 'react'
import {Select} from 'baseui/select'
import {codelist, ListName} from '../../../service/Codelist'
import {FieldArray, FormikProps} from 'formik'
import {ProcessFormValues} from '../../../constants'
import {renderTagList} from '../../common/TagList'
import {Block} from 'baseui/block'

const FieldProduct = (props: {formikBag: FormikProps<ProcessFormValues>}) => {
  return <FieldArray
    name='affiliation.products'
    render={arrayHelpers => (
      <>
        <Block width='100%'>
          <Block width='100%'>
            <Select
              clearable
              options={codelist.getParsedOptions(ListName.SYSTEM).filter(o => !props.formikBag.values.affiliation.products.includes(o.id))}
              onChange={({value}) => {
                arrayHelpers.form.setFieldValue('affiliation.products', [...props.formikBag.values.affiliation.products, ...value.map(v => v.id)])
              }}
            />
          </Block>
          <Block>{renderTagList(props.formikBag.values.affiliation.products.map(p => codelist.getShortname(ListName.SYSTEM, p)), arrayHelpers)}</Block>
        </Block>
      </>
    )}
  />
}

export default FieldProduct
