import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { LabelWithDescription } from '../common/LabelWithTooltip'
import { EndDate } from './EndDate'
import { StartDate } from './StartDate'

interface IDateModalProps {
  showDates: boolean
  showLabels?: boolean
}

export const DateFieldsProcessModal = (props: IDateModalProps) => {
  const [showDates, setShowDates] = useState<boolean>(props.showDates)

  return (
    <>
      {!showDates && (
        <div className='flex w-full mt-4'>
          <Button size='xsmall' type='button' onClick={() => setShowDates(true)}>
            Velg datoer
          </Button>
        </div>
      )}{' '}
      {showDates && (
        <>
          <div className='w-full max-w-lg'>
            <div className='my-7'>
              <LabelWithDescription
                label='Behandlingen er gyldig fra og med'
                description='Rediger dato dersom behandlingen ikke var gyldig allerede den datoen Nav ble opprettet. Datoen kan også settes fram i tid.'
              />
              <StartDate withoutLabel={true} />
            </div>
            <div className='my-7'>
              <LabelWithDescription
                label='Behandlingen er gyldig til og med'
                description='Velg dato kun dersom behandlingen er midlertidig og har en sluttdato.'
              />
              <EndDate withoutLabel={true} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
