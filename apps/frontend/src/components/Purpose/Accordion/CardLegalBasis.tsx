import * as React from 'react'
import { Select, TYPE, Value } from 'baseui/select'
import { Block, BlockProps } from 'baseui/block'
import { Card } from 'baseui/card'
import { StatefulInput } from 'baseui/input'
import { Label2 } from 'baseui/typography'
import { Button, KIND, SIZE as ButtonSize } from 'baseui/button'
import { codelist, ListName } from '../../../service/Codelist'
import { intl, theme } from '../../../util'
import { ErrorMessage, Field, FieldProps, Formik, FormikProps } from 'formik'
import { KIND as NKIND, Notification } from 'baseui/notification'
import { LegalBasisFormValues } from '../../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faPen } from '@fortawesome/free-solid-svg-icons'
import { PLACEMENT, StatefulTooltip } from 'baseui/tooltip'
import { legalBasisSchema } from '../../common/schema'
import { LegalBasisView } from '../../common/LegalBasis'
import { customizeNationalLawPlaceholder } from './PlaceholderCustomizer'
import { paddingZero } from '../../common/Style'

const rowBlockProps: BlockProps = {
  display: 'flex',
  marginTop: '1rem',
  width: '100%'
}

const Error = (props: { fieldName: string }) => (
  <ErrorMessage name={props.fieldName}>
    {msg => (
      <Block {...rowBlockProps} marginTop=".2rem">
        <Notification overrides={{Body: {style: {width: 'auto', ...paddingZero, marginTop: 0}}}} kind={NKIND.negative}>{msg}</Notification>
      </Block>
    )}
  </ErrorMessage>
)

const TooltipContent = () => (
  <Block>
    <p>{intl.legalBasisInfo}</p>
    <p>{intl.legalbasisGDPRArt9Info}</p>
  </Block>
)

const renderCardHeader = (text: string) => {
  return (
    <Block display="flex">
      <StatefulTooltip
        content={() => <TooltipContent/>}
        placement={PLACEMENT.top}
      >
        <Block display="flex">
          <Label2>{text}</Label2>
          <FontAwesomeIcon style={{marginLeft: '.25rem'}} icon={faExclamationCircle} color={theme.colors.primary300} size="sm"/>
        </Block>
      </StatefulTooltip>
    </Block>
  )
}

interface CardLegalBasisProps {
  initValue: LegalBasisFormValues;
  hideCard: () => void;
  submit: (val: LegalBasisFormValues) => void;
  titleSubmitButton: string;
}

const CardLegalBasis = ({submit, hideCard, initValue, titleSubmitButton}: CardLegalBasisProps) => {
  const [gdpr, setGdpr] = React.useState<Value>(
    initValue.gdpr ? codelist.getParsedOptions(ListName.GDPR_ARTICLE).filter(value => value.id === initValue.gdpr) : []
  )
  const [nationalLaw, setNationalLaw] = React.useState<Value>(
    initValue.nationalLaw ? codelist.getParsedOptions(ListName.NATIONAL_LAW).filter(value => value.id === initValue.nationalLaw) : []
  )
  // Must be complete to achieve touched on submit
  const initialValues: LegalBasisFormValues = {
    gdpr: initValue.gdpr,
    nationalLaw: initValue.nationalLaw,
    description: initValue.description,
  }

  return (
    <Formik
      onSubmit={(values, form) => submit(values)}
      validationSchema={legalBasisSchema()} initialValues={initialValues}
      render={(form: FormikProps<LegalBasisFormValues>) => {
        return (
          <Card>
            {renderCardHeader(intl.legalBasisNew)}
            <Block {...rowBlockProps}>
              <Field name="gdpr"
                     render={() => (
                       <Select
                         autoFocus={true}
                         options={codelist.getParsedOptions(ListName.GDPR_ARTICLE)}
                         placeholder={intl.gdprSelect}
                         maxDropdownHeight="300px"
                         type={TYPE.search}
                         onChange={({value}) => {
                           setGdpr(value)
                           form.setFieldValue('gdpr', value.length > 0 ? value[0].id : undefined)
                         }}
                         value={gdpr}
                         error={!!form.errors.gdpr && !!form.submitCount}
                       />
                     )}/>
            </Block>
            <Error fieldName="gdpr"/>

            <Block {...rowBlockProps} display={codelist.requiresNationalLaw(form.values.gdpr) ? rowBlockProps.display : 'none'}>
              <Field name="nationalLaw"
                     render={() => (
                       <Select
                         options={codelist.getParsedOptions(ListName.NATIONAL_LAW)}

                         placeholder={intl.nationalLawSelect}
                         maxDropdownHeight="300px"
                         type={TYPE.search}
                         onChange={({value}) => {
                           setNationalLaw(value)
                           form.setFieldValue('nationalLaw', value.length > 0 ? value[0].id : undefined)
                         }}
                         value={nationalLaw}
                         error={!!form.errors.nationalLaw && !!form.submitCount}
                       />
                     )}/>
            </Block>
            <Error fieldName="nationalLaw"/>

            <Block {...rowBlockProps} display={codelist.requiresDescription(form.values.gdpr) ? rowBlockProps.display : 'none'}>
              <Field name="description"
                     render={({field}: FieldProps<string, LegalBasisFormValues>) => (
                       <StatefulInput
                         {...field}
                         initialState={{value: initValue.description}}
                         placeholder={customizeNationalLawPlaceholder(gdpr)}
                         error={!!form.errors.description && !!form.submitCount}
                         startEnhancer={() => <span><FontAwesomeIcon icon={faPen}/></span>}
                       />
                     )}
              />
            </Block>
            <Error fieldName="description"/>

            <Block {...rowBlockProps} justifyContent="flex-end">
              <Button type='button' kind={KIND.minimal} size={ButtonSize.compact} onClick={() => hideCard()}>
                {intl.abort}
              </Button>
              <Button type='button' kind={KIND.secondary} size={ButtonSize.compact} onClick={form.submitForm}>
                {titleSubmitButton}
              </Button>
            </Block>

            {form.values.gdpr && (
              <>
                <Block {...rowBlockProps}>{intl.preview}</Block>
                <Block {...rowBlockProps}><LegalBasisView legalBasisForm={form.values}/></Block>
              </>
            )}
          </Card>
        )
      }}/>
  )
}

export default CardLegalBasis
