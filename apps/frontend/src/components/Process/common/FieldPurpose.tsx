import * as React from 'react'
import { codelist, ListName } from '../../../service/Codelist'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { ProcessFormValues } from '../../../constants'
import { Block } from 'baseui/block'
import { Select } from "@navikt/ds-react";
import { intl } from '../../../util'

const FieldPurpose = (props: { formikBag: FormikProps<ProcessFormValues> }) => {
  const { formikBag } = props

  return (
    <FieldArray
      name="purposes"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <Block width="100%">
          <Block width="100%">
            <Select label={intl.overallPurposeActivity} description={intl.overallPurposeHelpText}>
              <option value="">Velg overordnet behandlingsaktivitet</option>
              {codelist
                .getParsedOptions(ListName.PURPOSE)
                .filter((o) => !formikBag.values.purposes.includes(o.id))
                .map((o) => (<option value={o.id}>{o.label}</option>))
              }
            </Select>
          </Block>
        </Block>
      )}
    />
  )
}

export default FieldPurpose
