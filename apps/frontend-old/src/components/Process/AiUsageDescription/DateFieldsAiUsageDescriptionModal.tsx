import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { EndDate } from './EndDate'
import { StartDate } from './StartDate'

interface IDateModalProps {
  showDates: boolean
}

export const DateFieldsAiUsageDescriptionModal = (props: IDateModalProps) => {
  const [showDates, setShowDates] = useState<boolean>(props.showDates)

  return (
    <>
      {!showDates && (
        <div className="flex w-full mt-4">
          <Button size="xsmall" type="button" onClick={() => setShowDates(true)}>
            Velg datoer
          </Button>
        </div>
      )}{' '}
      {showDates && (
        <>
          <div className="w-full">
            <div className="flex w-full">
              <StartDate />

              <EndDate />
            </div>
          </div>
        </>
      )}
    </>
  )
}
