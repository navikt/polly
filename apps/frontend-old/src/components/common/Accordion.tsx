import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'

export const toggleOverride = {
  component: (iconProps: any) => {
    return iconProps.title !== 'Expand' ? (
      <ChevronDownIcon aria-hidden className="block" />
    ) : (
      <ChevronRightIcon aria-hidden className="block" />
    )
  },
}
