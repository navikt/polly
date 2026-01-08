import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

export interface IPaginationLabels {
  prevButton?: string
  nextButton?: string
  preposition?: string
}

export interface IPaginationProps {
  currentPage: number
  numPages: number
  onPageChange: (arg: { nextPage: number; prevPage: number }) => void
  labels?: IPaginationLabels
  className?: string
}

export default function Pagination({
  currentPage,
  numPages,
  onPageChange,
  labels,
  className,
}: IPaginationProps) {
  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= numPages

  const prev = () => {
    const target = Math.max(1, currentPage - 1)
    onPageChange({ nextPage: target, prevPage: target })
  }

  const next = () => {
    const target = Math.min(numPages, currentPage + 1)
    onPageChange({ nextPage: target, prevPage: currentPage })
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Button
        size="small"
        variant="tertiary"
        onClick={prev}
        disabled={prevDisabled}
        aria-label={labels?.prevButton ?? 'Forrige'}
        icon={<ChevronLeftIcon aria-hidden />}
        iconPosition="left"
      >
        {labels?.prevButton ?? 'Forrige'}
      </Button>

      <span className="text-sm">
        {currentPage} {labels?.preposition ?? 'av'} {numPages}
      </span>

      <Button
        size="small"
        variant="tertiary"
        onClick={next}
        disabled={nextDisabled}
        aria-label={labels?.nextButton ?? 'Neste'}
        icon={<ChevronRightIcon aria-hidden />}
        iconPosition="right"
      >
        {labels?.nextButton ?? 'Neste'}
      </Button>
    </div>
  )
}
