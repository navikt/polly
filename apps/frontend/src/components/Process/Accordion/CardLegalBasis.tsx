import * as React from 'react'
import { TYPE, Value } from 'baseui/select'
import { Block, BlockProps } from 'baseui/block'
import { StatefulInput } from 'baseui/input'
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button'
import { codelist, ListName, SensitivityLevel } from '../../../service/Codelist'
import { intl } from '../../../util'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from 'formik'
import { KIND as NKIND, Notification } from 'baseui/notification'
import { LegalBasisFormValues } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { legalBasisSchema } from '../../common/schema'
import { LegalBasisView } from '../../common/LegalBasis'
import { customizeNationalLawPlaceholder } from './PlaceholderCustomizer'
import { paddingZero } from '../../common/Style'
import shortid from 'shortid'
import { Label, Select } from "@navikt/ds-react"

const rowBlockProps: BlockProps = {
  display: 'flex',
  marginTop: '1rem',
  width: '100%',
}

const Error = (props: { fieldName: string }) => (
  <ErrorMessage name={props.fieldName}>
    {(msg: any) => (
      <Block {...rowBlockProps} marginTop=".2rem">
        <Notification overrides={{ Body: { style: { width: 'auto', ...paddingZero, marginTop: 0 } } }} kind={NKIND.negative}>
          {msg}
        </Notification>
      </Block>
    )}
  </ErrorMessage>
)

const renderCardHeader = (text: string, sensitivityLevel: SensitivityLevel) => {
  return (
      <div className="navds-form-field navds-form-field--medium">
        <Label className="navds-form-field__label navds-label">{text}</Label>
        <div className="navds-form-field__description navds-body-short navds-body-short--medium">{sensitivityLevel === SensitivityLevel.ART6 ? intl.article6HelpText : intl.article9HelpText}</div>
      </div>
  )
}

interface CardLegalBasisProps {
  initValue: LegalBasisFormValues
  hideCard: () => void
  submit: (val: LegalBasisFormValues) => void
  titleSubmitButton: string
  sensitivityLevel?: SensitivityLevel
}

const CardLegalBasis = ({ submit, hideCard, initValue, titleSubmitButton, sensitivityLevel }: CardLegalBasisProps) => {
  const [gdpr, setGdpr] = React.useState<Value>(initValue.gdpr ? codelist.getParsedOptions(ListName.GDPR_ARTICLE).filter((value) => value.id === initValue.gdpr) : [])
  const [nationalLaw, setNationalLaw] = React.useState<Value>(
    initValue.nationalLaw ? codelist.getParsedOptions(ListName.NATIONAL_LAW).filter((value) => value.id === initValue.nationalLaw) : [],
  )
  // Must be complete to achieve touched on submit
  const initialValues: LegalBasisFormValues = {
    gdpr: initValue.gdpr,
    nationalLaw: initValue.nationalLaw,
    description: initValue.description,
    key: shortid.generate(),
  }

  const getOptionsBySensitivityLevel = () => {
    if (sensitivityLevel === SensitivityLevel.ART6) {
      return codelist.getParsedOptions(ListName.GDPR_ARTICLE).filter((l) => codelist.isArt6(l.id))
    } else if (sensitivityLevel === SensitivityLevel.ART9) {
      return codelist.getParsedOptions(ListName.GDPR_ARTICLE).filter((l) => codelist.isArt9(l.id))
    }
    return codelist.getParsedOptions(ListName.GDPR_ARTICLE)
  }

  return (
    <Formik
      onSubmit={(values, form) => submit(values)}
      validationSchema={legalBasisSchema()}
      initialValues={initialValues}
      render={(form: FormikProps<LegalBasisFormValues>) => {
        return (
          <div>
            {renderCardHeader(
              sensitivityLevel === SensitivityLevel.ART9 ? intl.cardHeaderArticle9 : intl.cardHeaderArticle6,
              sensitivityLevel === SensitivityLevel.ART9 ? SensitivityLevel.ART9 : SensitivityLevel.ART6,
            )}
            <Block {...rowBlockProps}>
              <Field
                name="gdpr"
                render={() => (
                  <Select label="" error={!!form.errors.gdpr && !!form.submitCount}>
                    <option value="">{sensitivityLevel === SensitivityLevel.ART9 ? intl.placeHolderArticle9 : intl.placeHolderArticle6}</option>
                    {getOptionsBySensitivityLevel().map((o) => <option value={o.id}>{o.label}</option>)}
                  </Select>
                )}
              />
            </Block>
            <Error fieldName="gdpr" />

            <Block {...rowBlockProps} display={codelist.requiresNationalLaw(form.values.gdpr) ? rowBlockProps.display : 'none'}>
              <Field
                name="nationalLaw"
                render={() => (
                  <Select label="" error={!!form.errors.nationalLaw && !!form.submitCount}>
                    <option value="">{intl.nationalLawSelect}</option>
                    {codelist.getParsedOptions(ListName.NATIONAL_LAW).map((o) => <option value={o.id}>{o.label}</option>)}
                  </Select>
                )}
              />
            </Block>
            <Error fieldName="nationalLaw" />

            <Block {...rowBlockProps} display={codelist.requiresDescription(form.values.gdpr) ? rowBlockProps.display : 'none'}>
              <Field
                name="description"
                render={({ field }: FieldProps<string, LegalBasisFormValues>) => (
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
            </Block>
            <Error fieldName="description" />

            <Block {...rowBlockProps} justifyContent="flex-end">
              <Button type="button" kind={KIND.tertiary} size={ButtonSize.compact} onClick={() => hideCard()}>
                {intl.abort}
              </Button>
              <Button type="button" kind={KIND.secondary} size={ButtonSize.compact} onClick={form.submitForm}>
                {titleSubmitButton}
              </Button>
            </Block>

            {form.values.gdpr && (
              <>
                <Block {...rowBlockProps}>{intl.preview}</Block>
                <Block {...rowBlockProps}>
                  <LegalBasisView legalBasisForm={form.values} />
                </Block>
              </>
            )}
          </div>
        )
      }}
    />
  )
}

export default CardLegalBasis
