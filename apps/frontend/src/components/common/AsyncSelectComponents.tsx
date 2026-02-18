import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import { useEffect, useRef, useState } from 'react'
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
  inputId?: string
  instanceId?: string
  onChange: (newValue: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => void
  loadOptions?: (
    inputValue: string,
    callback: (options: OptionsOrGroups<any, any>) => void
  ) => Promise<OptionsOrGroups<any, any>> | void
}

export const CustomSearchSelect = (props: ICustomSearchSelectProps) => {
  const { ariaLabel, placeholder, inputId, instanceId, onChange, loadOptions } = props

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [dialogPortalTarget, setDialogPortalTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const closestDialog = (wrapper.closest('dialog') ||
      wrapper.closest('[role="dialog"]')) as HTMLElement | null

    setDialogPortalTarget(closestDialog)
  }, [])

  const menuPortalTarget =
    dialogPortalTarget ?? (typeof document !== 'undefined' ? document.body : undefined)
  return (
    <div ref={wrapperRef} className="w-full">
      <AsyncSelect
        className="w-full"
        aria-label={ariaLabel}
        inputId={inputId}
        instanceId={instanceId}
        placeholder={placeholder}
        components={{ DropdownIndicator }}
        noOptionsMessage={({ inputValue }) => noOptionMessage(inputValue)}
        controlShouldRenderValue={false}
        loadingMessage={() => 'Søker...'}
        isClearable={false}
        loadOptions={loadOptions}
        onChange={onChange}
        menuPortalTarget={menuPortalTarget}
        menuPosition={menuPortalTarget ? 'fixed' : 'absolute'}
        styles={selectOverrides}
      />
    </div>
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
      color: 'var(--ax-text-neutral)',
      backgroundColor: 'var(--ax-bg-input)',
      border: '1px solid var(--ax-border-neutral)',
      borderColor: 'var(--ax-border-neutral)',
      borderRadius: 'var(--ax-radius-8)',
      ':focus-within': {
        borderColor: 'var(--ax-border-strong)',
        outline: '3px solid var(--ax-border-focus)',
        outlineOffset: '3px',
      },
      ':focus': { borderColor: 'var(--ax-border-strong)' },
      ':hover': { borderColor: 'var(--ax-border-strong)' },
    }) as CSSObjectWithLabel,
  menu: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      backgroundColor: 'var(--ax-bg-raised)',
      border: '1px solid var(--ax-border-subtleA)',
      boxShadow: 'var(--ax-shadow-dialog)',
      marginTop: '0.25rem',
      borderRadius: 'var(--ax-radius-12)',
      overflow: 'hidden',
      zIndex: 9999,
    }) as CSSObjectWithLabel,
  menuPortal: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      zIndex: 9999,
    }) as CSSObjectWithLabel,
  menuList: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      padding: 0,
    }) as CSSObjectWithLabel,
  option: (base: CSSObjectWithLabel, state: any) =>
    ({
      ...base,
      color: 'var(--ax-text-neutral)',
      backgroundColor: state.isFocused
        ? 'var(--ax-bg-moderate-hoverA)'
        : state.isSelected
          ? 'var(--ax-bg-moderate-pressedA)'
          : 'var(--ax-bg-raised)',
      ':active': {
        backgroundColor: 'var(--ax-bg-moderate-pressedA)',
      },
    }) as CSSObjectWithLabel,
  input: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: 'var(--ax-text-neutral)',
    }) as CSSObjectWithLabel,
  placeholder: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: 'var(--ax-text-subtle)',
    }) as CSSObjectWithLabel,
  singleValue: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: 'var(--ax-text-neutral)',
    }) as CSSObjectWithLabel,
  dropdownIndicator: (base: CSSObjectWithLabel) =>
    ({
      ...base,
      color: 'var(--ax-text-neutral)',
      ':hover': { color: 'var(--ax-text-neutral)' },
    }) as CSSObjectWithLabel,
  indicatorSeparator: () => ({ display: 'none' }) as CSSObjectWithLabel,
}

export default CustomSearchSelect
