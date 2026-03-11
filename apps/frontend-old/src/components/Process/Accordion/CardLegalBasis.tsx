import { Alert, Button, Detail, Label, Select, TextField } from '@navikt/ds-react'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from 'formik'
import shortid from 'shortid'
import { ILegalBasisFormValues } from '../../../constants'
import {
  EListName,
  ESensitivityLevel,
  ICodelistProps,
  IGetParsedOptionsProps,
} from '../../../service/Codelist'
import { LegalBasisView } from '../../common/LegalBasis'
import { legalBasisSchema } from '../../common/schemaValidation'
import { customizeNationalLawPlaceholder } from './PlaceholderCustomizer'

const Error = (props: { fieldName: string }) => (
  <ErrorMessage name={props.fieldName}>
    {(msg: any) => (
      <div className="flex mt-4 w-full">
        <Alert variant="error" size="small" className="w-full">
          {msg}
        </Alert>
      </div>
    )}
  </ErrorMessage>
)

const renderCardHeader = (text: string, sensitivityLevel: ESensitivityLevel) => (
  <div>
    <Label>{text}</Label>
    <Detail>
      {sensitivityLevel === ESensitivityLevel.ART6
        ? 'Alle behandlinger av personopplysninger krever et behandlingsgrunnlag iht. personopplysningsloven artikkel 6.'
        : 'Alle behandlinger av særlige kategorier (sensitive) av personopplysninger krever i tillegg et behandlingsgrunnlag iht personopplysningsloven artikkel 9.'}
    </Detail>
  </div>
)

interface ICardLegalBasisProps {
  codelistUtils: ICodelistProps
  initValue: ILegalBasisFormValues
  hideCard: () => void
  submit: (val: ILegalBasisFormValues) => void
  titleSubmitButton: string
  sensitivityLevel?: ESensitivityLevel
}

const CardLegalBasis = ({
  codelistUtils,
  submit,
  hideCard,
  initValue,
  titleSubmitButton,
  sensitivityLevel,
}: ICardLegalBasisProps) => {
  // Must be complete to achieve touched on submit
  const initialValues: ILegalBasisFormValues = {
    gdpr: initValue.gdpr,
    nationalLaw: initValue.nationalLaw,
    description: initValue.description,
    key: shortid.generate(),
  }

  const getOptionsBySensitivityLevel = () => {
    if (sensitivityLevel === ESensitivityLevel.ART6) {
      return codelistUtils
        .getParsedOptions(EListName.GDPR_ARTICLE)
        .filter((parsedOption: IGetParsedOptionsProps) => codelistUtils.isArt6(parsedOption.id))
    } else if (sensitivityLevel === ESensitivityLevel.ART9) {
      return codelistUtils
        .getParsedOptions(EListName.GDPR_ARTICLE)
        .filter((parsedOption: IGetParsedOptionsProps) => codelistUtils.isArt9(parsedOption.id))
    }
    return codelistUtils.getParsedOptions(EListName.GDPR_ARTICLE)
  }

  return (
    <Formik
      onSubmit={(values) => submit(values)}
      validationSchema={legalBasisSchema()}
      initialValues={initialValues}
      render={(form: FormikProps<ILegalBasisFormValues>) => (
        <div className="bg-white p-4 rounded shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)]">
          {renderCardHeader(
            sensitivityLevel === ESensitivityLevel.ART9
              ? 'Behandlingsgrunnlag for særlige kategorier'
              : 'Behandlingsgrunnlag',
            sensitivityLevel === ESensitivityLevel.ART9
              ? ESensitivityLevel.ART9
              : ESensitivityLevel.ART6
          )}
          <div className="flex mt-4 w-full">
            <Field name="gdpr">
              {() => (
                <Select
                  className="w-full"
                  label={
                    sensitivityLevel === ESensitivityLevel.ART9
                      ? 'Velg fra artikkel 9'
                      : 'Velg fra artikkel 6'
                  }
                  onChange={(event) => {
                    form.setFieldValue('gdpr', event.target.value)
                  }}
                  error={!!form.errors.gdpr && !!form.submitCount}
                >
                  <option value="">Velg gdpr</option>
                  {getOptionsBySensitivityLevel().map((artikkel) => (
                    <option value={artikkel.id} key={artikkel.id}>
                      {artikkel.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Error fieldName="gdpr" />

          <div
            className={`mt-4 w-full ${codelistUtils.requiresNationalLaw(form.values.gdpr) ? 'flex' : 'hidden'}`}
          >
            <Field name="nationalLaw">
              {() => (
                <Select
                  className="w-full"
                  label="Velg lov eller forskrift"
                  hideLabel
                  aria-label="Velg lov eller forskrift"
                  onChange={(event) => {
                    form.setFieldValue('nationalLaw', event.target.value)
                  }}
                  value={form.values.nationalLaw}
                  error={!!form.errors.nationalLaw && !!form.submitCount}
                >
                  <option value="">Velg lov eller forskrift</option>
                  {codelistUtils.getParsedOptions(EListName.NATIONAL_LAW).map((lov) => (
                    <option value={lov.id} key={lov.id}>
                      {lov.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Error fieldName="nationalLaw" />
          <div
            className={`mt-4 w-full ${codelistUtils.requiresDescription(form.values.gdpr) ? 'flex' : 'hidden'}`}
          >
            <Field name="description">
              {({ field }: FieldProps<string, ILegalBasisFormValues>) => (
                <TextField
                  {...field}
                  className="w-full"
                  label="Beskrivelse"
                  hideLabel
                  placeholder={customizeNationalLawPlaceholder(form.values.gdpr || '')}
                  error={!!form.errors.description && !!form.submitCount}
                />
              )}
            </Field>
          </div>
          <Error fieldName="description" />
          <div className="flex mt-4 w-full justify-end">
            <Button type="button" variant="tertiary" size="xsmall" onClick={() => hideCard()}>
              Avbryt
            </Button>
            <Button type="button" variant="secondary" size="xsmall" onClick={form.submitForm}>
              {titleSubmitButton}
            </Button>
          </div>

          {form.values.gdpr && (
            <>
              <div className="flex mt-4 w-full">Forhåndsvisning</div>
              <div className="flex mt-4 w-full ">
                <LegalBasisView legalBasisForm={form.values} codelistUtils={codelistUtils} />
              </div>
            </>
          )}
        </div>
      )}
    />
  )
}

export default CardLegalBasis
