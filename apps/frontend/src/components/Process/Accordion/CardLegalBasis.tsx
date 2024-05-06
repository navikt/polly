import * as React from 'react'
import { Select, TYPE, Value } from 'baseui/select'
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input'
import { LabelMedium } from 'baseui/typography'
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button'
import { codelist, ListName, SensitivityLevel } from '../../../service/Codelist'
import { theme } from '../../../util'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from 'formik'
import { KIND as NKIND, Notification } from 'baseui/notification'
import { LegalBasisFormValues } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faPen } from '@fortawesome/free-solid-svg-icons'
import { legalBasisSchema } from '../../common/schema'
import { LegalBasisView } from '../../common/LegalBasis'
import { customizeNationalLawPlaceholder } from './PlaceholderCustomizer'
import { paddingZero } from '../../common/Style'
import shortid from 'shortid'
import CustomizedStatefulTooltip from '../../common/CustomizedStatefulTooltip'

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
    <Block display="flex">
      <CustomizedStatefulTooltip content={sensitivityLevel === SensitivityLevel.ART6 ? 'Alle behandlinger av personopplysninger krever et behandlingsgrunnlag iht. personopplysningsloven artikkel 6.'
        : 'Alle behandlinger av særlige kategorier (sensitive) av personopplysninger krever i tillegg et behandlingsgrunnlag iht personopplysningsloven artikkel 9.'}>
        <Block display="flex">
          <LabelMedium>{text}</LabelMedium>
          <FontAwesomeIcon style={{ marginLeft: '.25rem' }} icon={faExclamationCircle} color={theme.colors.primary300} size="sm" />
        </Block>
      </CustomizedStatefulTooltip>
    </Block>
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
          <Card>
            {renderCardHeader(
              sensitivityLevel === SensitivityLevel.ART9 ? 'Behandlingsgrunnlag for særlige kategorier' : 'Behandlingsgrunnlag',
              sensitivityLevel === SensitivityLevel.ART9 ? SensitivityLevel.ART9 : SensitivityLevel.ART6,
            )}
            <Block {...rowBlockProps}>
              <Field
                name="gdpr"
                render={() => (
                  <Select
                    autoFocus={true}
                    options={getOptionsBySensitivityLevel()}
                    placeholder={sensitivityLevel === SensitivityLevel.ART9 ? 'Velg fra artikkel 9' : 'Velg fra artikkel 6'}
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
            </Block>
            <Error fieldName="gdpr" />

            <Block {...rowBlockProps} display={codelist.requiresNationalLaw(form.values.gdpr) ? rowBlockProps.display : 'none'}>
              <Field
                name="nationalLaw"
                render={() => (
                  <Select
                    options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}
                    placeholder='Velg lov eller forskrift'
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
                Avbryt
              </Button>
              <Button type="button" kind={KIND.secondary} size={ButtonSize.compact} onClick={form.submitForm}>
                {titleSubmitButton}
              </Button>
            </Block>

            {form.values.gdpr && (
              <>
                <Block {...rowBlockProps}>Forhåndsvisning</Block>
                <Block {...rowBlockProps}>
                  <LegalBasisView legalBasisForm={form.values} />
                </Block>
              </>
            )}
          </Card>
        )
      }}
    />
  )
}

export default CardLegalBasis
