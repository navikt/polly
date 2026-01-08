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
      className="w-full"
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
  menu: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      backgroundColor: '#ffffff',
      border: '1px solid #e6e6e6',
      boxShadow: 'var(--a-shadow-medium)',
      marginTop: '0.25rem',
      zIndex: 1000,
    }) as CSSObjectWithLabel,
  menuList: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      padding: 0,
    }) as CSSObjectWithLabel,
  option: (base: CSSObjectWithLabel, state: any) =>
    ({
      ...base,
      color: '#1a1a1a',
      backgroundColor: state.isFocused ? '#f5f5f5' : state.isSelected ? '#ededed' : '#ffffff',
      ':active': {
        backgroundColor: '#ededed',
      },
    }) as CSSObjectWithLabel,
  input: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: '#1a1a1a',
    }) as CSSObjectWithLabel,
  placeholder: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: '#6b7280',
    }) as CSSObjectWithLabel,
  singleValue: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: '#1a1a1a',
    }) as CSSObjectWithLabel,
  dropdownIndicator: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: '#1a1a1a',
      ':hover': { color: '#1a1a1a' },
    }) as CSSObjectWithLabel,
  indicatorSeparator: () => ({ display: 'none' }) as CSSObjectWithLabel,
}

export default CustomSearchSelect
