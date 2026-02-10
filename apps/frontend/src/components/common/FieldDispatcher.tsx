import { Select } from '@navikt/ds-react'
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik'
import { IDpProcessFormValues, IProcessFormValues } from '../../constants'
import { EListName, ICodelistProps } from '../../service/Codelist'
import { renderTagList } from './TagList'

type TFieldDispatcherProps = {
  formikBag: FormikProps<IProcessFormValues> | FormikProps<IDpProcessFormValues>
  codelistUtils: ICodelistProps
}

const FieldDispatcher = (props: TFieldDispatcherProps) => {
  const { formikBag, codelistUtils } = props

  return (
    <FieldArray
      name="affiliation.disclosureDispatchers"
      render={(arrayHelpers: FieldArrayRenderProps) => (
        <>
          <div className="w-full">
            <div className="w-full">
              <Select
                label="Velg avsender"
                hideLabel
                onChange={(event) => {
                  if (event.target.value) {
                    arrayHelpers.form.setFieldValue('affiliation.disclosureDispatchers', [
                      ...formikBag.values.affiliation.disclosureDispatchers,
                      event.target.value,
                    ])
                  }
                }}
              >
                <option value="">Velg avsender</option>
                {codelistUtils
                  .getParsedOptions(EListName.SYSTEM)
                  .filter(
                    (option) =>
                      !formikBag.values.affiliation.disclosureDispatchers.includes(option.id)
                  )
                  .map((avsender) => (
                    <option key={avsender.id} value={avsender.id}>
                      {avsender.label}
                    </option>
                  ))}
              </Select>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {renderTagList(
                formikBag.values.affiliation.disclosureDispatchers.map((disclosureDispatcher) =>
                  codelistUtils.getShortname(EListName.SYSTEM, disclosureDispatcher)
                ),
                arrayHelpers
              )}
            </div>
          </div>
        </>
      )}
    />
  )
}

export default FieldDispatcher
