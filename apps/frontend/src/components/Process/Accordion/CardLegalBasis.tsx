import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Detail } from '@navikt/ds-react'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input'
import { KIND as NKIND, Notification } from 'baseui/notification'
import { Select, TYPE, Value } from 'baseui/select'
import { LabelMedium } from 'baseui/typography'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from 'formik'
import { useState } from 'react'
import shortid from 'shortid'
import { ILegalBasisFormValues } from '../../../constants'
import {
  CodelistService,
  EListName,
  ESensitivityLevel,
  IGetParsedOptionsProps,
} from '../../../service/Codelist'
import { LegalBasisView } from '../../common/LegalBasis'
import { paddingZero } from '../../common/Style'
import { legalBasisSchema } from '../../common/schemaValidation'
import { customizeNationalLawPlaceholder } from './PlaceholderCustomizer'

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
  const [codelistUtils] = CodelistService()

  const [gdpr, setGdpr] = useState<Value>(
    initValue.gdpr
      ? codelistUtils
          .getParsedOptions(EListName.GDPR_ARTICLE)
          .filter((value) => value.id === initValue.gdpr)
      : []
  )
  const [nationalLaw, setNationalLaw] = useState<Value>(
    initValue.nationalLaw
      ? codelistUtils
          .getParsedOptions(EListName.NATIONAL_LAW)
          .filter((value: IGetParsedOptionsProps) => value.id === initValue.nationalLaw)
      : []
  )
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
      validationSchema={legalBasisSchema(codelistUtils)}
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
                  options={getOptionsBySensitivityLevel()}
                  placeholder={
                    sensitivityLevel === ESensitivityLevel.ART9
                      ? 'Velg fra artikkel 9'
                      : 'Velg fra artikkel 6'
                  }
                  maxDropdownHeight="300px"
                  type={TYPE.search}
                  onChange={({ value }) => {
                    setGdpr(value)
                    form.setFieldValue('gdpr', value.length > 0 ? value[0].id : undefined)
                  }}
                  value={gdpr}
                  error={!!form.errors.gdpr && !!form.submitCount}
                  overrides={{ Placeholder: { style: { color: 'black' } } }}
                />
              )}
            />
          </div>
          <Error fieldName="gdpr" />

          <div
            className={`mt-4 w-full ${codelistUtils.requiresNationalLaw(form.values.gdpr) ? 'flex' : 'hidden'}`}
          >
            <Field
              name="nationalLaw"
              render={() => (
                <Select
                  options={codelistUtils.getParsedOptions(EListName.NATIONAL_LAW)}
                  placeholder="Velg lov eller forskrift"
                  maxDropdownHeight="300px"
                  type={TYPE.search}
                  onChange={({ value }) => {
                    setNationalLaw(value)
                    form.setFieldValue('nationalLaw', value.length > 0 ? value[0].id : undefined)
                  }}
                  value={nationalLaw}
                  error={!!form.errors.nationalLaw && !!form.submitCount}
                />
              )}
            />
          </div>
          <Error fieldName="nationalLaw" />
          <div
            className={`mt-4 w-full ${codelistUtils.requiresDescription(form.values.gdpr) ? 'flex' : 'hidden'}`}
          >
            <Field
              name="description"
              render={({ field }: FieldProps<string, ILegalBasisFormValues>) => (
                <StatefulInput
                  {...field}
                  initialState={{ value: initValue.description }}
                  placeholder={customizeNationalLawPlaceholder(gdpr)}
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
