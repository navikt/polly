import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import {
  ActionMeta,
  CSSObjectWithLabel,
  DropdownIndicatorProps,
  OnChangeValue,
  OptionsOrGroups,
  components,
} from 'react-select'
import AsyncSelect from 'react-select/async'

interface ICustomSearchSelectProps {
  ariaLabel: string
  placeholder: string
  onChange: (newValue: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => void
  loadOptions?: (
    inputValue: string,
    callback: (options: OptionsOrGroups<any, any>) => void
  ) => Promise<OptionsOrGroups<any, any>> | void
}

export const CustomSearchSelect = (props: ICustomSearchSelectProps) => {
  const { ariaLabel, placeholder, onChange, loadOptions } = props
  return (
    <AsyncSelect
      aria-label={ariaLabel}
      placeholder={placeholder}
      components={{ DropdownIndicator }}
      noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
      controlShouldRenderValue={false}
      loadingMessage={() => 'Søker...'}
      isClearable={false}
      loadOptions={loadOptions}
      onChange={onChange}
      styles={selectOverrides}
    />
  )
}

export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <MagnifyingGlassIcon title="Søk" aria-label="Søk" />
    </components.DropdownIndicator>
  )
}

export const noOptionMessage = (inputValue: string) => {
  if (inputValue.length < 3 && inputValue.length > 0) {
    return 'Skriv minst 3 tegn for å søke'
  } else if (inputValue.length >= 3) {
    return `Fant ingen resultater for "${inputValue}"`
  } else {
    return ''
  }
}

export const selectOverrides = {
  control: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      cursor: 'text',
      height: '3rem',
      color: 'var(--a-gray-900)',
      border: '1px solid var(--a-gray-500)',
      borderRadius: 'var(--a-border-radius-medium)',
      ':focus-within': {
        boxShadow: 'var(--a-shadow-focus)',
        outline: 'none',
      },
      ':focus': { borderColor: 'var(--a-deepblue-600)' },
      ':hover': { borderColor: 'var(--a-border-action)' },
    }) as CSSObjectWithLabel,
}

export default CustomSearchSelect
