import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Detail, Select } from '@navikt/ds-react'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input'
import { KIND as NKIND, Notification } from 'baseui/notification'
//import { Value} from 'baseui/select'
import { LabelMedium } from 'baseui/typography'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from 'formik'
//import {useState} from 'react'
import shortid from 'shortid'
import { ILegalBasisFormValues } from '../../../constants'
import { EListName, ESensitivityLevel, codelist } from '../../../service/Codelist'
import { LegalBasisView } from '../../common/LegalBasis'
import { paddingZero } from '../../common/Style'
import { legalBasisSchema } from '../../common/schema'

//import {customizeNationalLawPlaceholder} from './PlaceholderCustomizer'

const Error = (props: { fieldName: string }) => (
  <ErrorMessage name={props.fieldName}>
    {(msg: any) => (
      <div className="flex mt-4 w-full">
        <Notification
          overrides={{ Body: { style: { width: 'auto', ...paddingZero, marginTop: 0 } } }}
          kind={NKIND.negative}
        >
          {msg}
        </Notification>
      </div>
    )}
  </ErrorMessage>
)

const renderCardHeader = (text: string, sensitivityLevel: ESensitivityLevel) => (
  <div>
    <LabelMedium>{text}</LabelMedium>
    <Detail>
      {sensitivityLevel === ESensitivityLevel.ART6
        ? 'Alle behandlinger av personopplysninger krever et behandlingsgrunnlag iht. personopplysningsloven artikkel 6.'
        : 'Alle behandlinger av særlige kategorier (sensitive) av personopplysninger krever i tillegg et behandlingsgrunnlag iht personopplysningsloven artikkel 9.'}
    </Detail>
  </div>
)

interface ICardLegalBasisProps {
  initValue: ILegalBasisFormValues
  hideCard: () => void
  submit: (val: ILegalBasisFormValues) => void
  titleSubmitButton: string
  sensitivityLevel?: ESensitivityLevel
}

const CardLegalBasis = ({
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
      return codelist.getParsedOptions(EListName.GDPR_ARTICLE).filter((l) => codelist.isArt6(l.id))
    } else if (sensitivityLevel === ESensitivityLevel.ART9) {
      return codelist.getParsedOptions(EListName.GDPR_ARTICLE).filter((l) => codelist.isArt9(l.id))
    }
    return codelist.getParsedOptions(EListName.GDPR_ARTICLE)
  }

  return (
    <Formik
      onSubmit={(values) => submit(values)}
      validationSchema={legalBasisSchema()}
      initialValues={initialValues}
      render={(form: FormikProps<ILegalBasisFormValues>) => (
        <Card>
          {renderCardHeader(
            sensitivityLevel === ESensitivityLevel.ART9
              ? 'Behandlingsgrunnlag for særlige kategorier'
              : 'Behandlingsgrunnlag',
            sensitivityLevel === ESensitivityLevel.ART9
              ? ESensitivityLevel.ART9
              : ESensitivityLevel.ART6
          )}
          <div className="flex mt-4 w-full">
            <Field
              name="gdpr"
              render={() => (
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
            />
          </div>
          <Error fieldName="gdpr" />

          <div
            className={`mt-4 w-full ${codelist.requiresNationalLaw(form.values.gdpr) ? 'flex' : 'hidden'}`}
          >
            <Field
              name="nationalLaw"
              render={() => (
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
                  {codelist.getParsedOptions(EListName.NATIONAL_LAW).map((lov) => (
                    <option value={lov.id} key={lov.id}>
                      {lov.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>
          <Error fieldName="nationalLaw" />
          <div
            className={`mt-4 w-full ${codelist.requiresDescription(form.values.gdpr) ? 'flex' : 'hidden'}`}
          >
            <Field
              name="description"
              render={({ field }: FieldProps<string, ILegalBasisFormValues>) => (
                <StatefulInput
                  {...field}
                  initialState={{ value: initValue.description }}
                  // placeholder={customizeNationalLawPlaceholder(gdpr)}
                  error={!!form.errors.description && !!form.submitCount}
                  startEnhancer={() => (
                    <span>
                      <FontAwesomeIcon icon={faPen} />
                    </span>
                  )}
                />
              )}
            />
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
                <LegalBasisView legalBasisForm={form.values} />
              </div>
            </>
          )}
        </Card>
      )}
    />
  )
}

export default CardLegalBasis
